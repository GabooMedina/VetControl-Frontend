import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoVetControl from '../assets/VetControl.png';
import MetaDescription from '../components/shared/MetaDescription';
import { register, login } from './services/authService';
import { getCompanies, Company } from './services/companyService';

const SignUp = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [empresas, setEmpresas] = useState<Company[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar empresas al montar
    Promise.all([
      getCompanies()
    ])
      .then(([empresas]) => {
        setEmpresas(empresas);
      })
      .catch(() => {
        setEmpresas([]);
      });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password.trim() || !empresa) {
      setError('Por favor, complete todos los campos');
      return;
    }
    try {
      const user = {
        nombre,
        apellido,
        email,
        contraseña: password, // Para el backend
        password, // Para cumplir con el tipado local
        id_empresa: empresa as any // Forzar a any para evitar error de tipo UUID
      };
      console.log('Registrando usuario:', user);
      await register(user);
      // Login automático tras registro
      const response = await login(email, password);
      if (response) {
        localStorage.setItem("token", response.access_token);
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error?.response?.data?.message ?? 'Error al registrar. Verifique los datos.');
    }
  }, [nombre, apellido, email, password, empresa, navigate]);

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
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">REGISTRARSE</h2>
            <form onSubmit={handleSubmit} autoComplete="on" aria-label="Formulario de registro">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="w-full p-3 bg-gray-200 rounded text-base md:text-lg"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  aria-label="Nombre"
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Apellido"
                  className="w-full p-3 bg-gray-200 rounded text-base md:text-lg"
                  value={apellido}
                  onChange={e => setApellido(e.target.value)}
                  aria-label="Apellido"
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 bg-gray-200 rounded text-base md:text-lg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-label="Email"
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
              <div className="mb-4">
                <select
                  className="w-full p-3 bg-gray-200 rounded text-base md:text-lg"
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                  aria-label="Empresa"
                  required
                >
                  <option value="">Selecciona una empresa</option>
                  {empresas.map((emp) => (
                    <option key={emp.id_empresa} value={emp.id_empresa}>{emp.nombre}</option>
                  ))}
                </select>
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
                Registrarse
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <a href="/signin" className="text-blue-900 hover:underline">
                  Inicia Sesión
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;