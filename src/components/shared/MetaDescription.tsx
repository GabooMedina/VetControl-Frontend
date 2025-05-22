import { useEffect } from 'react';

interface MetaDescriptionProps {
  description: string;
}

const MetaDescription = ({ description }: MetaDescriptionProps) => {
  useEffect(() => {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
    return () => {
      // Limpieza opcional: restaurar o eliminar la meta si es necesario
    };
  }, [description]);
  return null;
};

export default MetaDescription;
