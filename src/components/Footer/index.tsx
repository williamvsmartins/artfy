interface FooterProps {
  black?: boolean;
}

export function Footer({ black = false }: FooterProps) {
  return (
    <div className={`mt-16 text-center p-4 ${black ? 'text-black' : ''}`}>
      <a
        href="https://github.com/williamvsmartins"
        target="_blank"
        rel="noreferrer"
        className={`font-extrabold mt-12 ${
          black ? 'text-black' : 'text-white'
        }`}
      >
        Desenvolvido por <span className="underline">williamvsmartins</span>
        <br />
      </a>
      <div className="flex flex-col sm:flex-row gap-6 justify-center mb-3 text-xs mt-6">
        <span className={`font-light ${black ? 'text-black' : 'text-white'}`}>
          Termos de Serviço
        </span>
        <span className={`font-light ${black ? 'text-black' : 'text-white'}`}>
          Política de Privacidade
        </span>
        <span className={`font-light ${black ? 'text-black' : 'text-white'}`}>
          Impressão
        </span>
      </div>
      <div className="mt-10 text-xs">
        <p
          className={`font-extralight text-left ${
            black ? 'text-black' : 'text-white'
          }`}
        >
          Spotify é uma marca registrada da Spotify AB. Artfy não está associado
          ao Spotify.
        </p>
      </div>
    </div>
  );
}
