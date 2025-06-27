import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface OverleafCredentials {
  email: string
  password: string
}

interface OverleafResponse {
  success: boolean
  projectId?: string
  url?: string
  error?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const latexUri = formData.get('snip_uri') as string
    const engine = formData.get('engine') as string || 'xelatex'

    // Credenciais do Overleaf (em produção, isso estaria em variáveis de ambiente)
    const credentials: OverleafCredentials = {
      email: 'roney.nascimento@usp.br',
      password: '@#$Fisica7989'
    }

    console.log('🚀 Iniciando processo de submissão ao Overleaf...')

    // Step 1: Login no Overleaf
    const loginResult = await loginToOverleaf(credentials)
    if (!loginResult.success) {
      throw new Error('Falha no login: ' + loginResult.error)
    }

    console.log('✅ Login realizado com sucesso')

    // Step 2: Criar projeto com LaTeX
    const projectResult = await createOverleafProject(loginResult.sessionCookie!, latexUri, engine)
    if (!projectResult.success) {
      throw new Error('Falha na criação do projeto: ' + projectResult.error)
    }

    console.log('✅ Projeto criado:', projectResult.projectId)

    // Step 3: Aguardar compilação
    const compilationResult = await waitForCompilation(loginResult.sessionCookie!, projectResult.projectId!, engine)
    
    const response: OverleafResponse = {
      success: compilationResult.success,
      projectId: projectResult.projectId,
      url: projectResult.url,
      error: compilationResult.error
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Erro no processo:', error)
    
    const response: OverleafResponse = {
      success: false,
      error: error.message
    }

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function loginToOverleaf(credentials: OverleafCredentials): Promise<{
  success: boolean
  sessionCookie?: string
  error?: string
}> {
  try {
    // Step 1: Get CSRF token
    const loginPageResponse = await fetch('https://www.overleaf.com/login', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const loginPageHtml = await loginPageResponse.text()
    const csrfMatch = loginPageHtml.match(/name="_csrf" value="([^"]+)"/)
    
    if (!csrfMatch) {
      throw new Error('CSRF token não encontrado')
    }

    const csrfToken = csrfMatch[1]
    const cookies = loginPageResponse.headers.get('set-cookie') || ''

    // Step 2: Perform login
    const loginData = new URLSearchParams({
      '_csrf': csrfToken,
      'email': credentials.email,
      'password': credentials.password
    })

    const loginResponse = await fetch('https://www.overleaf.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.overleaf.com/login'
      },
      body: loginData,
      redirect: 'manual'
    })

    if (loginResponse.status === 302) {
      const sessionCookie = loginResponse.headers.get('set-cookie')
      return {
        success: true,
        sessionCookie: sessionCookie || cookies
      }
    } else {
      return {
        success: false,
        error: 'Credenciais inválidas'
      }
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function createOverleafProject(sessionCookie: string, latexUri: string, engine: string): Promise<{
  success: boolean
  projectId?: string
  url?: string
  error?: string
}> {
  try {
    // Usar a API oficial do Overleaf para criar projeto
    const formData = new FormData()
    formData.append('snip_uri', latexUri)
    formData.append('engine', engine)
    formData.append('visual_editor', 'false')

    const response = await fetch('https://www.overleaf.com/docs', {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.overleaf.com/'
      },
      body: formData,
      redirect: 'manual'
    })

    if (response.status === 302) {
      const location = response.headers.get('location')
      if (location && location.includes('/project/')) {
        const projectIdMatch = location.match(/\/project\/([a-f0-9]+)/)
        if (projectIdMatch) {
          return {
            success: true,
            projectId: projectIdMatch[1],
            url: `https://www.overleaf.com${location}`
          }
        }
      }
    }

    return {
      success: false,
      error: 'Falha na criação do projeto'
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function waitForCompilation(sessionCookie: string, projectId: string, engine: string): Promise<{
  success: boolean
  pdfUrl?: string
  error?: string
}> {
  try {
    // Aguardar um tempo para compilação
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Tentar forçar compilação
    const compileResponse = await fetch(`https://www.overleaf.com/project/${projectId}/compile`, {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        rootDoc_id: null,
        compiler: engine,
        timeout: 60
      })
    })

    if (compileResponse.ok) {
      const compileResult = await compileResponse.json()
      
      if (compileResult.status === 'success') {
        return {
          success: true,
          pdfUrl: `https://www.overleaf.com/project/${projectId}/output/output.pdf`
        }
      } else {
        return {
          success: false,
          error: compileResult.error || 'Erro na compilação'
        }
      }
    }

    return {
      success: false,
      error: 'Falha na comunicação com o compilador'
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

console.log('🧪 Overleaf Submit Function iniciada!') 