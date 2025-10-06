import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebook, 
  faTwitter, 
  faWhatsapp, 
  faTelegram, 
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { faShare, faCopy } from '@fortawesome/free-solid-svg-icons';

export default function SocialShare({ bookmark, url }) {
  const shareText = `¡Mira este marcador en Rizoma: ${bookmark.title}!`;
  const shareUrl = url || window.location.href;
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Aquí podrías agregar una notificación de éxito
      alert('¡Enlace copiado al portapapeles!');
    } catch (err) {
      console.error('Error al copiar: ', err);
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const openShare = () => {
    if (navigator.share) {
      navigator.share({
        title: bookmark.title,
        text: shareText,
        url: shareUrl
      }).catch(err => console.log('Error al compartir:', err));
    } else {
      // Fallback: mostrar opciones de compartir
      const shareMenu = document.getElementById('share-menu');
      if (shareMenu) {
        shareMenu.classList.toggle('hidden');
      }
    }
  };

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Compartir:</span>
        {navigator.share && (
          <button
            onClick={openShare}
            className="btn btn-xs btn-ghost"
            title="Compartir nativo"
          >
            <FontAwesomeIcon icon={faShare} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-xs btn-outline hover:btn-primary flex items-center gap-1"
          title="Facebook"
        >
          <FontAwesomeIcon icon={faFacebook} className="text-blue-600" />
          <span className="text-xs">Facebook</span>
        </a>
        
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-xs btn-outline hover:btn-info flex items-center gap-1"
          title="Twitter"
        >
          <FontAwesomeIcon icon={faTwitter} className="text-blue-400" />
          <span className="text-xs">Twitter</span>
        </a>
        
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-xs btn-outline hover:btn-success flex items-center gap-1"
          title="WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="text-green-500" />
          <span className="text-xs">WhatsApp</span>
        </a>
        
        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-xs btn-outline hover:btn-info flex items-center gap-1"
          title="Telegram"
        >
          <FontAwesomeIcon icon={faTelegram} className="text-blue-500" />
          <span className="text-xs">Telegram</span>
        </a>
        
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-xs btn-outline hover:btn-primary flex items-center gap-1"
          title="LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedin} className="text-blue-700" />
          <span className="text-xs">LinkedIn</span>
        </a>
        
        <button
          onClick={copyToClipboard}
          className="btn btn-xs btn-outline hover:btn-neutral flex items-center gap-1"
          title="Copiar enlace"
        >
          <FontAwesomeIcon icon={faCopy} />
          <span className="text-xs">Copiar</span>
        </button>
      </div>
    </div>
  );
}
