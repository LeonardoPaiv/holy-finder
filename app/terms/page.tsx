import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.webp"
                alt="Mapa da Fé Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center">
            Termos e Condições de Uso
          </h1>
          <p className="text-blue-100 text-center mt-2">
            Mapa da Fé - Stellar Seed
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-8 text-gray-700">
          {/* Last Updated */}
          <p className="text-sm text-gray-500 italic">
            Última atualização: 26 de dezembro de 2025
          </p>

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
            <p className="leading-relaxed">
              Bem-vindo ao <strong>Mapa da Fé</strong>, um aplicativo desenvolvido e operado pela <strong>Stellar Seed</strong>. 
              O Mapa da Fé é uma plataforma dedicada a conectar pessoas a templos religiosos e suas comunidades, 
              oferecendo informações sobre horários de missas, localização, eventos e informações de contato.
            </p>
            <p className="leading-relaxed mt-3">
              Ao utilizar nosso aplicativo, você concorda em cumprir e estar vinculado a estes Termos e Condições de Uso. 
              Se você não concordar com qualquer parte destes termos, não deverá utilizar o Mapa da Fé.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Aceitação dos Termos</h2>
            <p className="leading-relaxed">
              Ao acessar ou usar o Mapa da Fé, você confirma que leu, compreendeu e concorda em estar vinculado a estes 
              Termos e Condições, bem como à nossa Política de Privacidade. Estes termos aplicam-se a todos os usuários 
              do aplicativo, incluindo visitantes, usuários cadastrados e instituições religiosas.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Descrição do Serviço</h2>
            <p className="leading-relaxed mb-3">
              O Mapa da Fé oferece duas áreas principais:
            </p>
            <div className="ml-6 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">3.1. Área Pública</h3>
                <p className="leading-relaxed">
                  Acesso livre a informações sobre templos religiosos, incluindo horários de missas, localização, 
                  eventos e informações de contato divulgadas pelas próprias instituições religiosas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">3.2. Área Restrita para Instituições Religiosas</h3>
                <p className="leading-relaxed">
                  Área exclusiva para instituições religiosas cadastradas, permitindo o cadastro de templos, 
                  manutenção de informações, publicação de posts sobre a comunidade e gerenciamento de eventos. 
                  O acesso a esta área requer cadastro e autenticação.
                </p>
              </div>
            </div>
          </section>

          {/* User Accounts and Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Contas de Usuário e Responsabilidades</h2>
            <div className="ml-6 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">4.1. Cadastro</h3>
                <p className="leading-relaxed">
                  Para acessar a área restrita, instituições religiosas devem criar uma conta fornecendo informações 
                  precisas, completas e atualizadas. Você é responsável por manter a confidencialidade de suas credenciais 
                  de acesso e por todas as atividades realizadas em sua conta.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">4.2. Obrigações do Usuário</h3>
                <p className="leading-relaxed">Ao utilizar o Mapa da Fé, você concorda em:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Fornecer informações verdadeiras e precisas durante o cadastro</li>
                  <li>Manter suas informações de conta atualizadas</li>
                  <li>Não compartilhar suas credenciais de acesso com terceiros</li>
                  <li>Notificar imediatamente a Stellar Seed sobre qualquer uso não autorizado de sua conta</li>
                  <li>Ser o único responsável por todas as atividades realizadas em sua conta</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Política de Conteúdo e Responsabilidade do Usuário</h2>
            <div className="ml-6 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">5.1. Conteúdo Proibido</h3>
                <p className="leading-relaxed">
                  O Mapa da Fé é <strong>extremamente contra</strong> a divulgação de conteúdos sensíveis, ofensivos, 
                  ilegais ou que violem as normas brasileiras. É estritamente proibido publicar:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Conteúdo que incite violência, ódio ou discriminação</li>
                  <li>Material pornográfico, obsceno ou sexualmente explícito</li>
                  <li>Informações falsas, enganosas ou difamatórias</li>
                  <li>Conteúdo que viole direitos de propriedade intelectual de terceiros</li>
                  <li>Informações pessoais de terceiros sem consentimento</li>
                  <li>Qualquer conteúdo que viole as leis brasileiras ou direitos de terceiros</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">5.2. Responsabilidade pelo Conteúdo</h3>
                <p className="leading-relaxed">
                  <strong>Você é integralmente responsável</strong> por todo o conteúdo que publicar, compartilhar ou 
                  transmitir através do Mapa da Fé. Embora a Stellar Seed possua mecanismos para prevenir a divulgação 
                  de conteúdo inadequado, <strong>a responsabilidade final recai sobre o usuário</strong> que publica 
                  o conteúdo.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">5.3. Conformidade Legal</h3>
                <p className="leading-relaxed">
                  Você concorda em cumprir todas as leis e regulamentos brasileiros aplicáveis ao usar o Mapa da Fé, 
                  incluindo, mas não se limitando a, leis de proteção de dados (LGPD), direitos autorais, difamação e 
                  crimes cibernéticos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">5.4. Consequências de Violações</h3>
                <p className="leading-relaxed">
                  Violações desta política de conteúdo podem resultar em:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Remoção imediata do conteúdo inadequado</li>
                  <li>Suspensão temporária ou permanente de sua conta</li>
                  <li>Responsabilização legal e financeira por danos causados</li>
                  <li>Denúncia às autoridades competentes, quando aplicável</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Moderation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Moderação</h2>
            <div className="ml-6 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">6.1. Equipe de Moderação</h3>
                <p className="leading-relaxed">
                  O Mapa da Fé possui uma equipe de moderadores responsável por garantir o cumprimento destes Termos e 
                  Condições e manter a integridade da plataforma.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">6.2. Acesso a Dados de Cadastro</h3>
                <p className="leading-relaxed">
                  Os moderadores possuem acesso aos dados de cadastro dos usuários na plataforma para fins de verificação, 
                  investigação de violações e aplicação de medidas disciplinares. Este acesso é estritamente regulamentado 
                  e limitado ao necessário para o exercício de suas funções.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">6.3. Responsabilidades dos Moderadores</h3>
                <p className="leading-relaxed">Os moderadores devem:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Respeitar a privacidade dos usuários e tratar os dados com confidencialidade</li>
                  <li>Aplicar as normas de forma justa e consistente</li>
                  <li>Remover conteúdos que violem estes termos</li>
                  <li>Aplicar punições proporcionais às violações cometidas</li>
                  <li>Documentar adequadamente as ações de moderação</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">6.4. Direito de Recurso</h3>
                <p className="leading-relaxed">
                  Usuários que tiverem conteúdo removido ou conta suspensa podem contestar a decisão entrando em contato 
                  com a Stellar Seed através dos canais de suporte. Todas as contestações serão analisadas de forma justa 
                  e imparcial.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriedade Intelectual</h2>
            <div className="ml-6 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">7.1. Propriedade da Plataforma</h3>
                <p className="leading-relaxed">
                  O Mapa da Fé, incluindo seu código-fonte, design, logotipos, marcas registradas e todo o conteúdo 
                  original criado pela Stellar Seed, é de propriedade exclusiva da Stellar Seed e está protegido por 
                  leis de propriedade intelectual brasileiras e internacionais.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">7.2. Licença de Conteúdo do Usuário</h3>
                <p className="leading-relaxed">
                  Ao publicar conteúdo no Mapa da Fé, você concede à Stellar Seed uma licença mundial, não exclusiva, 
                  livre de royalties, transferível e sublicenciável para usar, reproduzir, distribuir, preparar obras 
                  derivadas, exibir e executar esse conteúdo em conexão com o serviço e os negócios da Stellar Seed.
                </p>
              </div>
            </div>
          </section>

          {/* Data Protection and Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Proteção de Dados e Privacidade (LGPD)</h2>
            <div className="ml-6 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">8.1. Conformidade com a LGPD</h3>
                <p className="leading-relaxed">
                  A Stellar Seed está comprometida em proteger seus dados pessoais em conformidade com a Lei Geral de 
                  Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">8.2. Dados Sensíveis</h3>
                <p className="leading-relaxed">
                  <strong>Afiliação religiosa é considerada dado pessoal sensível</strong> sob a LGPD. Ao utilizar o 
                  Mapa da Fé, você reconhece e consente expressamente com a coleta, armazenamento e processamento de 
                  informações sobre sua afiliação religiosa e de sua instituição.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">8.3. Tipos de Dados Coletados</h3>
                <p className="leading-relaxed">Coletamos os seguintes tipos de dados:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Dados de identificação (nome, e-mail, telefone)</li>
                  <li>Dados da instituição religiosa (nome, CNPJ, endereço, religião)</li>
                  <li>Dados de localização geográfica dos templos</li>
                  <li>Conteúdo publicado (posts, eventos, horários)</li>
                  <li>Dados de uso e navegação no aplicativo</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">8.4. Base Legal para Processamento</h3>
                <p className="leading-relaxed">
                  O processamento de seus dados pessoais é baseado em:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Consentimento explícito do titular dos dados</li>
                  <li>Cumprimento de obrigação legal ou regulatória</li>
                  <li>Execução de contrato ou procedimentos preliminares</li>
                  <li>Exercício regular de direitos em processo judicial, administrativo ou arbitral</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">8.5. Direitos do Titular dos Dados</h3>
                <p className="leading-relaxed">
                  Você tem os seguintes direitos sob a LGPD:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Confirmação da existência de tratamento de dados</li>
                  <li>Acesso aos seus dados pessoais</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                  <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Portabilidade dos dados a outro fornecedor de serviço</li>
                  <li>Eliminação dos dados tratados com base no consentimento</li>
                  <li>Informação sobre compartilhamento de dados</li>
                  <li>Revogação do consentimento</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">8.6. Segurança dos Dados</h3>
                <p className="leading-relaxed">
                  Implementamos medidas técnicas e organizacionais robustas para proteger seus dados pessoais contra 
                  acesso não autorizado, destruição, perda, alteração ou divulgação, incluindo criptografia, controles 
                  de acesso e monitoramento contínuo.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">8.7. Compartilhamento de Dados</h3>
                <p className="leading-relaxed">
                  Seus dados podem ser compartilhados com:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Provedores de serviços de hospedagem e infraestrutura</li>
                  <li>Autoridades governamentais, quando exigido por lei</li>
                  <li>Moderadores da plataforma, conforme descrito na seção 6</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">8.8. Retenção de Dados</h3>
                <p className="leading-relaxed">
                  Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais 
                  foram coletados, incluindo requisitos legais, contábeis ou de relatórios. Após esse período, os dados 
                  serão eliminados ou anonimizados.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">8.9. Contato para Questões de Privacidade</h3>
                <p className="leading-relaxed">
                  Para exercer seus direitos ou esclarecer dúvidas sobre proteção de dados, entre em contato através 
                  dos canais indicados na seção 13 destes termos.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitação de Responsabilidade</h2>
            <div className="ml-6 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">9.1. Serviço "Como Está"</h3>
                <p className="leading-relaxed">
                  O Mapa da Fé é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, 
                  expressas ou implícitas. A Stellar Seed não garante que o serviço será ininterrupto, livre de erros 
                  ou seguro.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">9.2. Exclusão de Garantias</h3>
                <p className="leading-relaxed">
                  A Stellar Seed não garante a precisão, confiabilidade ou completude das informações publicadas por 
                  terceiros no aplicativo. As informações sobre templos, horários e eventos são de responsabilidade 
                  das instituições religiosas que as publicam.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">9.3. Limitação de Responsabilidade</h3>
                <p className="leading-relaxed">
                  Na extensão máxima permitida pela lei brasileira, a Stellar Seed não será responsável por:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Danos indiretos, incidentais, especiais, consequenciais ou punitivos</li>
                  <li>Perda de lucros, receitas, dados ou uso</li>
                  <li>Conteúdo publicado por usuários</li>
                  <li>Ações ou omissões de terceiros</li>
                  <li>Interrupções ou falhas no serviço</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">9.4. Responsabilidade do Usuário</h3>
                <p className="leading-relaxed">
                  Você concorda em indenizar e isentar a Stellar Seed, seus diretores, funcionários e agentes de 
                  quaisquer reclamações, danos, obrigações, perdas, responsabilidades, custos ou dívidas decorrentes 
                  de: (a) seu uso do Mapa da Fé; (b) violação destes Termos; (c) violação de direitos de terceiros; 
                  ou (d) conteúdo que você publicar.
                </p>
              </div>
            </div>
          </section>

          {/* Modifications to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modificações dos Termos</h2>
            <p className="leading-relaxed">
              A Stellar Seed reserva-se o direito de modificar estes Termos e Condições a qualquer momento. 
              Notificaremos os usuários sobre alterações significativas através do aplicativo ou por e-mail. 
              O uso continuado do Mapa da Fé após a publicação de alterações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Rescisão</h2>
            <div className="ml-6 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">11.1. Rescisão pela Stellar Seed</h3>
                <p className="leading-relaxed">
                  A Stellar Seed pode suspender ou encerrar sua conta e acesso ao Mapa da Fé a qualquer momento, 
                  com ou sem aviso prévio, por qualquer motivo, incluindo violação destes Termos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">11.2. Rescisão pelo Usuário</h3>
                <p className="leading-relaxed">
                  Você pode descontinuar o uso do Mapa da Fé a qualquer momento. Para solicitar a exclusão de sua 
                  conta e dados, entre em contato através dos canais de suporte.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Lei Aplicável e Jurisdição</h2>
            <p className="leading-relaxed">
              Estes Termos e Condições são regidos e interpretados de acordo com as leis da República Federativa do 
              Brasil. Qualquer disputa decorrente destes termos será submetida à jurisdição exclusiva dos tribunais 
              brasileiros, com renúncia expressa a qualquer outro foro, por mais privilegiado que seja.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Informações de Contato</h2>
            <p className="leading-relaxed">
              Para questões relacionadas a estes Termos e Condições, proteção de dados ou suporte geral, entre em 
              contato com a Stellar Seed:
            </p>
            <div className="mt-3 ml-6">
              <p className="leading-relaxed"><strong>Empresa:</strong> Stellar Seed</p>
              <p className="leading-relaxed"><strong>Aplicativo:</strong> Mapa da Fé</p>
              <p className="leading-relaxed"><strong>E-mail:</strong> contato@stellarseed.com.br</p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="border-t pt-6">
            <p className="leading-relaxed text-center font-semibold">
              Ao utilizar o Mapa da Fé, você reconhece que leu, compreendeu e concorda em estar vinculado a estes 
              Termos e Condições de Uso.
            </p>
          </section>
        </div>

        {/* Footer Button */}
        <div className="bg-gray-50 px-8 py-6 border-t">
          <Link 
            href="/"
            className="block w-full sm:w-auto sm:mx-auto text-center px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Voltar ao Mapa
          </Link>
        </div>
      </div>
    </div>
  );
}
