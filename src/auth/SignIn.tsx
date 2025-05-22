import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logoVetControl from '../assets/VetControl.png';
import MetaDescription from '../components/shared/MetaDescription';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por Favor, Complete Todos los Campos');
      return;
    }
    try {
      // Aquí irá la lógica de autenticación del backend
      // console.log('Iniciando sesión con:', { email, password });
      navigate('/dashboard');
    } catch {
      setError('Error al iniciar sesión. Verifique sus credenciales.');
    }
  }, [email, password, navigate]);

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
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">BIENVENIDO</h2>
            <form onSubmit={handleSubmit} autoComplete="on" aria-label="Formulario de inicio de sesión">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Usuario"
                  className="w-full p-3 bg-gray-200 rounded text-base md:text-lg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="username"
                  aria-label="Usuario"
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full p-3 bg-gray-200 rounded text-base md:text-lg"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  aria-label="Contraseña"
                  required
                />
              </div>
              {error && (
                <div className="mb-2 text-red-600 text-sm" role="alert">{error}</div>
              )}
              <div className="text-right mb-6">
                <button type="button" className="text-sm text-gray-600 hover:text-blue-900">
                  Olvidaste tu contraseña
                </button>
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-gray-300 hover:bg-gray-400 rounded text-gray-800 font-medium text-base md:text-lg transition-colors"
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;