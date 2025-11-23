import React from 'react';

// --- Types ---

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';
type Status = 'success' | 'warning' | 'error' | 'info' | 'neutral';

// --- 1. Typography ---

export const Text: React.FC<{
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small';
  className?: string;
  children: React.ReactNode;
  as?: any;
}> = ({ variant = 'body', className = '', children, as }) => {
  const styles = {
    h1: 'text-3xl md:text-4xl font-black tracking-tight text-gray-900',
    h2: 'text-2xl md:text-3xl font-bold text-gray-900',
    h3: 'text-xl font-bold text-gray-900',
    h4: 'text-lg font-semibold text-gray-800',
    body: 'text-base text-gray-600 leading-relaxed',
    caption: 'text-sm text-gray-500 font-medium',
    small: 'text-xs text-gray-400 font-bold uppercase tracking-wider',
  };

  const Component = as || (variant.startsWith('h') ? variant : 'p');

  return <Component className={`${styles[variant]} ${className}`}>{children}</Component>;
};

// --- 2. Button ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon,
  className = '', 
  disabled,
  ...props 
}) => {
  
  const base = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20 focus:ring-primary-500",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-soft focus:ring-gray-200",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-gray-500 hover:text-primary-600 hover:bg-primary-50/50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <i className="fas fa-circle-notch fa-spin"></i>
      ) : (
        <>
          {icon && <i className={`fas ${icon} ${children ? 'ltr:mr-2 rtl:ml-2' : ''}`}></i>}
          {children}
        </>
      )}
    </button>
  );
};

// --- 3. Card ---

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'glass' | 'plain' | 'hover';
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'white', 
  noPadding = false,
  className = '', 
  ...props 
}) => {
  const base = "rounded-2xl transition-all duration-300";
  
  const variants = {
    white: "bg-white border border-gray-100 shadow-card",
    glass: "glass shadow-lg",
    plain: "bg-transparent",
    hover: "bg-white border border-gray-100 shadow-soft hover:shadow-card hover:-translate-y-1 cursor-pointer",
  };

  return (
    <div className={`${base} ${variants[variant]} ${noPadding ? '' : 'p-6'} ${className}`} {...props}>
      {children}
    </div>
  );
};

// --- 4. Input ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors pointer-events-none ltr:left-4 rtl:right-4 z-10">
            <i className={`fas ${icon}`}></i>
          </div>
        )}
        <input 
          className={`w-full py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 ${icon ? 'ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4' : 'px-4'} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''} ${className}`}
          {...props} 
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
};

// --- 5. Badge ---

export const Badge: React.FC<{ status: Status; children: React.ReactNode; icon?: string; className?: string }> = ({ status, children, icon, className = '' }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    error: 'bg-red-50 text-red-600 border-red-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]} ${className}`}>
      {icon && <i className={`fas ${icon}`}></i>}
      {children}
    </span>
  );
};

// --- 6. Avatar ---

export const Avatar: React.FC<{ src?: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-gray-500">{name.substring(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
};

// --- 7. IconButton ---
export const IconButton: React.FC<ButtonProps> = ({ icon, className = '', ...props }) => {
  return (
     <button 
       className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-primary-600 ${className}`}
       {...props}
     >
       <i className={`fas ${icon} text-lg`}></i>
     </button>
  );
}

// --- 8. Global Loader ---
export const GlobalLoader: React.FC = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-300 animate-fade-in">
    <div className="flex flex-col items-center gap-6 p-8 rounded-3xl">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <i className="fas fa-heart-pulse text-2xl text-primary-600"></i>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
         <p className="text-gray-900 font-bold text-lg tracking-tight">Loading...</p>
         <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Please Wait</p>
      </div>
    </div>
  </div>
);

// --- 9. Modal ---
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Content */}
      <div className="relative bg-white rounded-3xl shadow-float w-full max-w-md overflow-hidden animate-bounce-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <Text variant="h3" className="text-lg">{title}</Text>
          <IconButton icon="fa-times" onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200" />
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};