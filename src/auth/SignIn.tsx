import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoVetControl from '../assets/VetControl.png'; // Logo de VetControl

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!email.trim() || !password.trim()) {
        setError('Por Favor, Complete Todos los Campos');
        return;
    }

    try {
        // Aquí irá la lógica de autenticación del backend
        console.log('Iniciando sesión con:', {email, password });


        navigate('/dashboard'); // Redirige al dashboard después de iniciar sesión
    } catch (error) {
        setError('Error al iniciar sesión. Verifique sus credenciales.');
    }
};

  return (
    <div className="flex h-screen w-full">
      {/* Panel izquierdo con logo */}
      <div className="hidden md:flex md:w-1/2 bg-blue-900 items-center justify-center">
        <div className="p-8">
          <img 
            src={logoVetControl} 
            alt="VetControl Logo" 
            className="w-100"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.style.display = 'none';
              const parent = currentTarget.parentElement;
              if (parent) {
                const textElement = document.createElement('div');
                textElement.innerHTML = '<h1 class="text-3xl text-cyan-400 font-bold">Vet<span class="text-white">Control</span></h1>';
                parent.appendChild(textElement);
              }
            }}
          />
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <h2 className="text-2xl font-bold mb-8 text-center">BIENVENIDO</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Usuario"
                className="w-full p-2 bg-gray-200 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="mb-2">
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full p-2 bg-gray-200 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="text-right mb-6">
              <button type="button" className="text-sm text-gray-600 hover:text-blue-900">
                Olvidaste tu contraseña
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full p-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800 font-medium"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;