import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logoVetControl from '../assets/VetControl.png';
import MetaDescription from '../components/shared/MetaDescription';
import { login } from './services/authService';
import { showToast } from '../components/shared/Toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast.error('Por favor, complete todos los campos');
      return;
    }
    try {
      const response = await login(email, password);
      if (response) {
        console.log('Inicio de sesión exitoso:', response);
        localStorage.setItem("token", response.access_token);
        showToast.success('Inicio de sesión exitoso');

        // Obtener el usuario autenticado para conseguir su userId
        const authenticatedUser = await import('./services/authService').then(mod => mod.getAuthenticatedUser());
        if (authenticatedUser?.userId) {
          // Usar el userId para obtener el usuario completo y guardar id_empresa
          const user = await import('./services/userService').then(mod => mod.getUserById(authenticatedUser.userId));
          if (user?.id_empresa) {
            localStorage.setItem("empresa", user.id_empresa);
          }
        }

        navigate('/dashboard');
      }
    } catch {
      showToast.error('Error al iniciar sesión. Verifique sus credenciales.');
    }
  }, [email, password, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <>
      <MetaDescription description="Inicia sesión en VetControl para gestionar tu veterinaria de forma eficiente y segura." />
      <div className="flex flex-col md:flex-row h-screen w-full bg-white">
        {/* Panel izquierdo con logo */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-900 min-h-[180px] md:min-h-0">
          <div className="p-6 md:p-8 flex flex-col items-center justify-center w-full">
            <img
              src={logoVetControl}
              alt="Logo de VetControl"
              className="w-32 md:w-60 mx-auto mb-4 md:mb-0"
              loading="lazy"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.style.display = 'none';
                const parent = currentTarget.parentElement;
                if (parent) {
                  const textElement = document.createElement('div');
                  textElement.innerHTML = '<h1 class="text-2xl md:text-3xl text-cyan-400 font-bold text-center">Vet<span class="text-white">Control</span></h1>';
                  parent.appendChild(textElement);
                }
              }}
            />
          </div>
        </div>

        {/* Panel derecho con formulario */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md p-4 sm:p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center text-blue-900">BIENVENIDO</h2>
            <form onSubmit={handleSubmit} autoComplete="on" aria-label="Formulario de inicio de sesión">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Ingresa tu email"
                  className="w-full p-3 bg-gray-200 rounded text-base md:text-lg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-label="Email"
                  required
                />
              </div>
              <div className="mb-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="w-full p-3 bg-gray-200 rounded text-base md:text-lg pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  aria-label="Contraseña"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-900 focus:outline-none"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              
              <button
                type="submit"
                className="w-full p-3 bg-gray-300 hover:bg-gray-400 rounded text-gray-800 font-medium text-base md:text-lg transition-colors"
              >
                Ingresar
              </button>

            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <a href="/register" className="text-blue-900 hover:underline">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;