import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const uploadFoto = async (file, userId) => {
  const extensao = file.name.split('.').pop().toLowerCase();
  const nomeArquivo = `${userId}/${Date.now()}.${extensao}`;

  console.log('Iniciando upload:', nomeArquivo);
  console.log('Arquivo:', file.name, file.size, file.type);

  const { data, error } = await supabase.storage
    .from('Produtos')
    .upload(nomeArquivo, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error('Erro no upload:', error);
    throw error;
  }

  console.log('Upload concluído:', data);

  const { data: urlData } = supabase.storage
    .from('Produtos')
    .getPublicUrl(nomeArquivo);

  return urlData.publicUrl;
};