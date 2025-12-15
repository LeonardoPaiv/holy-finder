import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <Image
            src="/logo.webp"
            alt="Holy Finder Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-800">
          Caminho não encontrado
        </h2>
        
        <p className="text-gray-600 text-lg">
          Ops! Parece que você se perdeu no caminho da fé. 
          Não se preocupe, volte agora.
        </p>

        <div className="pt-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Voltar ao Mapa
          </Link>
        </div>
      </div>
    </div>
  );
}
