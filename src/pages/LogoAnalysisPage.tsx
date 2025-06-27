import React from 'react';
import { AccreditationGrid, AppleDistinguishedLogo } from '../components/AccreditationLogos';
import StPaulsLogo2 from '../components/StPaulsLogo2';

const LogoAnalysisPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-red mb-4">Análise de Logotipos do Site da St. Paul's School</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Análise detalhada de todos os logotipos encontrados no site da St. Paul's School.
          </p>
        </header>
        
        {/* Main Logo Section */}
        <section className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Logotipo Principal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Localização</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>No cabeçalho (header) de todas as páginas do site, posicionado no canto superior esquerdo</li>
                <li>No rodapé (footer) de todas as páginas do site, também posicionado à esquerda</li>
              </ul>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Características Técnicas</h3>
              <ul className="space-y-2">
                <li><span className="font-medium">URL da imagem:</span> <a href="https://resources.finalsite.net/images/v1676654471/stpaulsbr/aqfyyexsbjosffnt6bku/StPauls_updated.svg" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">resources.finalsite.net/...</a></li>
                <li><span className="font-medium">Formato:</span> SVG (Scalable Vector Graphics)</li>
                <li><span className="font-medium">Dimensões:</span> 300 x 91 pixels (proporção de aproximadamente 3:1)</li>
                <li><span className="font-medium">Tamanho do arquivo:</span> 24.189 bytes</li>
              </ul>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Elementos de Design</h3>
              <p className="text-gray-700">
                O logotipo principal consiste no texto "St. Paul's School" em tipografia serif elegante, 
                acompanhado do subtítulo "The British School of São Paulo" em fonte menor. 
                As cores predominantes são o vermelho escuro (#9E1B32) e preto, refletindo as cores 
                institucionais da escola.
              </p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center">
              <div className="bg-white p-6 rounded shadow-sm mb-6">
                <StPaulsLogo2 variant="header" isScrolled={true} className="h-20 w-auto" />
              </div>
              <div className="bg-primary-red p-6 rounded shadow-sm">
                <StPaulsLogo2 variant="header" isScrolled={false} className="h-20 w-auto" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Brasão Section */}
        <section className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Brasão da Escola</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Localização</h3>
              <p className="text-gray-700 mb-4">
                O brasão da escola aparece como parte do logotipo principal no cabeçalho do site, 
                posicionado à esquerda do texto "St. Paul's School".
              </p>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Características Técnicas</h3>
              <ul className="space-y-2">
                <li><span className="font-medium">Formato:</span> Parte do SVG do logotipo principal</li>
                <li><span className="font-medium">Dimensões aproximadas:</span> 60 x 80 pixels dentro do logotipo principal</li>
              </ul>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Elementos de Design</h3>
              <p className="text-gray-700">
                O brasão apresenta um escudo vermelho com um leão dourado/amarelo em posição de guarda, 
                simbolizando força, coragem e tradição. O contorno do escudo é em branco/prata, 
                criando contraste com o fundo vermelho do cabeçalho do site.
              </p>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Contexto no Site</h3>
              <p className="text-gray-700">
                O brasão é um elemento heráldico que representa a tradição britânica da instituição 
                e é parte fundamental da identidade visual da escola.
              </p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg flex items-center justify-center">
              <div className="bg-primary-red p-8 rounded-lg">
                <StPaulsLogo2 variant="shield" className="h-40 w-auto" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Favicon Section */}
        <section className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Favicon</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Localização</h3>
              <p className="text-gray-700 mb-4">
                O favicon aparece na aba do navegador quando o site é acessado.
              </p>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Características Técnicas</h3>
              <ul className="space-y-2">
                <li><span className="font-medium">URL da imagem:</span> <a href="https://www.stpauls.br/uploaded/favicon_(4).ico" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.stpauls.br/uploaded/favicon_(4).ico</a></li>
                <li><span className="font-medium">Formato:</span> ICO (Microsoft Icon)</li>
                <li><span className="font-medium">Dimensões:</span> 16 x 16 pixels</li>
                <li><span className="font-medium">Profundidade de cor:</span> 8 bits/pixel</li>
                <li><span className="font-medium">Tamanho do arquivo:</span> 1.406 bytes</li>
              </ul>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Elementos de Design</h3>
              <p className="text-gray-700">
                O favicon é uma versão simplificada do brasão da escola, mantendo o escudo 
                vermelho com o leão, adaptado para ser reconhecível mesmo em dimensões muito pequenas.
              </p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center">
              <div className="mb-6">
                <img src="/logos-fix/solid-color.png" alt="St. Paul's Favicon" className="h-16 w-auto" />
              </div>
              <div className="border border-gray-300 rounded-lg p-2 flex items-center bg-white">
                <div className="bg-gray-200 rounded-l-md p-1 flex items-center">
                  <img src="/logos-fix/solid-color.png" alt="St. Paul's Favicon" className="h-4 w-auto" />
                </div>
                <div className="px-3 text-sm text-gray-600">St. Paul's School - The British School of São Paulo</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Apple Distinguished School Logo */}
        <section className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Logotipo Apple Distinguished School</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Localização</h3>
              <p className="text-gray-700 mb-4">
                Este logotipo aparece na página específica sobre a certificação Apple Distinguished School: 
                <a href="https://www.stpauls.br/academic/digital-learning/apple-distinguished-school" 
                   className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                   https://www.stpauls.br/academic/digital-learning/apple-distinguished-school
                </a>
              </p>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Características Técnicas</h3>
              <ul className="space-y-2">
                <li><span className="font-medium">URL da imagem:</span> <a href="https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1682647851/stpaulsbr/mmohhv8zcayp4vkt8cgn/Untitleddesign20.png" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">resources.finalsite.net/...</a></li>
                <li><span className="font-medium">Formato:</span> PNG</li>
                <li><span className="font-medium">Dimensões:</span> 256 x 256 pixels</li>
                <li><span className="font-medium">Tamanho do arquivo:</span> 4.983 bytes</li>
              </ul>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Elementos de Design</h3>
              <p className="text-gray-700">
                O logotipo consiste no ícone da Apple em preto, acompanhado do texto "Distinguished School" 
                em tipografia sans-serif. Este logotipo representa a certificação concedida pela Apple 
                à St. Paul's School por sua excelência no uso de tecnologia no ambiente educacional.
              </p>
              
              <h3 className="font-semibold text-lg mt-5 mb-3">Contexto no Site</h3>
              <p className="text-gray-700">
                Este logotipo é utilizado para destacar a certificação importante recebida pela escola, 
                demonstrando seu compromisso com a inovação tecnológica na educação.
              </p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg flex items-center justify-center">
              <AppleDistinguishedLogo className="max-w-xs" />
            </div>
          </div>
        </section>
        
        {/* Accreditation Logos Section */}
        <section className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Logotipos de Acreditações e Parcerias</h2>
          
          <h3 className="font-semibold text-lg mb-3">Localização</h3>
          <p className="text-gray-700 mb-6">
            Estes logotipos aparecem principalmente na página de acreditações: 
            <a href="https://www.stpauls.br/about-us/accreditations" 
               className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
              https://www.stpauls.br/about-us/accreditations
            </a>
          </p>
          
          <h3 className="font-semibold text-lg mb-5">Logotipos das Acreditações</h3>
          <AccreditationGrid />
          
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-3">Elementos de Design</h3>
            <p className="text-gray-700 mb-4">
              Cada logotipo de acreditação mantém sua identidade visual original, representando as diversas 
              organizações e certificações internacionais com as quais a St. Paul's School está associada. 
              Estes logotipos utilizam diferentes paletas de cores e estilos, mas são apresentados de forma 
              uniforme no site, com dimensões padronizadas.
            </p>
            
            <h3 className="font-semibold text-lg mt-5 mb-3">Contexto no Site</h3>
            <p className="text-gray-700">
              Os logotipos de acreditações são exibidos em grade na página de acreditações, demonstrando 
              as credenciais internacionais da escola e reforçando sua reputação como instituição de ensino 
              de alto padrão.
            </p>
          </div>
        </section>
        
        {/* Logo Summary Section */}
        <section className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Resumo dos Logotipos</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left">Logotipo</th>
                  <th className="py-3 px-4 border-b text-left">Localização</th>
                  <th className="py-3 px-4 border-b text-left">Formato</th>
                  <th className="py-3 px-4 border-b text-left">Dimensões</th>
                  <th className="py-3 px-4 border-b text-left">Uso Principal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border-b">Logotipo Principal</td>
                  <td className="py-3 px-4 border-b">Cabeçalho e rodapé</td>
                  <td className="py-3 px-4 border-b">SVG</td>
                  <td className="py-3 px-4 border-b">300 x 91 px</td>
                  <td className="py-3 px-4 border-b">Identidade visual principal da escola</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border-b">Brasão</td>
                  <td className="py-3 px-4 border-b">Parte do logotipo principal</td>
                  <td className="py-3 px-4 border-b">SVG</td>
                  <td className="py-3 px-4 border-b">~60 x 80 px</td>
                  <td className="py-3 px-4 border-b">Símbolo heráldico da tradição da escola</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">Favicon</td>
                  <td className="py-3 px-4 border-b">Aba do navegador</td>
                  <td className="py-3 px-4 border-b">ICO</td>
                  <td className="py-3 px-4 border-b">16 x 16 px</td>
                  <td className="py-3 px-4 border-b">Identificação do site no navegador</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border-b">Apple Distinguished School</td>
                  <td className="py-3 px-4 border-b">Página específica</td>
                  <td className="py-3 px-4 border-b">PNG</td>
                  <td className="py-3 px-4 border-b">256 x 256 px</td>
                  <td className="py-3 px-4 border-b">Certificação de excelência tecnológica</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">HMC</td>
                  <td className="py-3 px-4 border-b">Página de acreditações</td>
                  <td className="py-3 px-4 border-b">PNG</td>
                  <td className="py-3 px-4 border-b">256 x 203 px</td>
                  <td className="py-3 px-4 border-b">Acreditação internacional</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border-b">Cambridge</td>
                  <td className="py-3 px-4 border-b">Página de acreditações</td>
                  <td className="py-3 px-4 border-b">PNG</td>
                  <td className="py-3 px-4 border-b">256 x 203 px</td>
                  <td className="py-3 px-4 border-b">Acreditação de currículo internacional</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">IB</td>
                  <td className="py-3 px-4 border-b">Página de acreditações</td>
                  <td className="py-3 px-4 border-b">JPEG</td>
                  <td className="py-3 px-4 border-b">256 x 203 px</td>
                  <td className="py-3 px-4 border-b">Acreditação de programa internacional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Conclusion Section */}
        <section className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Conclusão</h2>
          
          <p className="text-gray-700 mb-4">
            A St. Paul's School utiliza uma variedade de logotipos em seu site para comunicar sua identidade 
            visual, tradição e credenciais internacionais. O logotipo principal, com seu brasão característico, 
            é o elemento mais proeminente, aparecendo consistentemente no cabeçalho e rodapé de todas as páginas. 
            Os logotipos de acreditações e parcerias são utilizados estrategicamente para demonstrar a qualidade 
            e o reconhecimento internacional da instituição.
          </p>
          
          <p className="text-gray-700">
            A análise revela uma abordagem coesa para a apresentação dos logotipos, com dimensões padronizadas 
            para as acreditações e um destaque especial para o logotipo principal. A presença do brasão no 
            logotipo principal e como favicon reforça a tradição britânica da escola, enquanto os logotipos 
            de acreditações internacionais comunicam seu compromisso com padrões educacionais globais de excelência.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LogoAnalysisPage; 