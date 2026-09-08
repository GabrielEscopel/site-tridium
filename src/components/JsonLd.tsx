/** Injeta um bloco schema.org. Um componente para todos os tipos de dado
 *  estruturado do site — assim nenhuma página escreve <script> na mão. */
export function JsonLd({ dados }: { dados: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Conteúdo é gerado no servidor a partir de constantes do próprio projeto.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
