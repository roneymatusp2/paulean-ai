interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  href?: string;
  onClick?: () => void;
  className?: string;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  href, 
  onClick,
  className = ''
}: ButtonProps) => {
  const baseStyles = 'inline-block rounded-md font-medium transition duration-300';
  
  const variantStyles = {
    primary: 'bg-blue-800 text-white px-6 py-3 hover:bg-blue-700',
    outline: 'border-2 border-blue-800 text-blue-800 px-6 py-2 hover:bg-blue-800 hover:text-white'
  };
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  if (href) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
};

export default Button;