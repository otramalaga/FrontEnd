import React, { useState } from 'react';
import { 
  FaWhatsapp, 
  FaTelegram, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaLink,
  FaShare,
  FaTimes
} from 'react-icons/fa';

export default function ShareButton({ bookmark }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Construir la URL del marcador
  const bookmarkUrl = `${window.location.origin}/bookmark/${bookmark.id}`;
  const title = bookmark.title || 'Mira este lugar en AppMalaga';
  const description = bookmark.description || '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Error al copiar el enlace:', err);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: '#25D366',
      onClick: () => {
        const text = encodeURIComponent(`${title}\n\n${description}\n\n${bookmarkUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: '#0088cc',
      onClick: () => {
        const text = encodeURIComponent(title);
        window.open(`https://t.me/share/url?url=${encodeURIComponent(bookmarkUrl)}&text=${text}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: '#1877F2',
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(bookmarkUrl)}`, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: '#1DA1F2',
      onClick: () => {
        const text = encodeURIComponent(title);
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(bookmarkUrl)}&text=${text}`, '_blank');
      }
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: '#0A66C2',
      onClick: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(bookmarkUrl)}`, '_blank');
      }
    },
    {
      name: copied ? '¡Copiado!' : 'Copiar enlace',
      icon: FaLink,
      color: '#6B7280',
      onClick: handleCopyLink
    }
  ];

  return (
    <>
      <button
        className="btn btn-secondary text-white w-full gap-2"
        onClick={() => setIsOpen(true)}
      >
        <FaShare className="text-lg" />
        Compartir
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button
              className="btn btn-sm btn-circle absolute right-4 top-4"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
            
            <h3 className="font-bold text-2xl mb-6">Compartir marcador</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {shareOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button
                    key={index}
                    className={`btn btn-outline gap-2 hover:text-white ${
                      copied && option.name.includes('Copiado') ? 'btn-success' : ''
                    }`}
                    style={{
                      borderColor: option.color,
                      color: option.color
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = option.color;
                      e.currentTarget.style.borderColor = option.color;
                    }}
                    onMouseLeave={(e) => {
                      if (!copied || !option.name.includes('Copiado')) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = option.color;
                        e.currentTarget.style.color = option.color;
                      }
                    }}
                    onClick={option.onClick}
                    disabled={copied && option.name.includes('Copiado')}
                  >
                    <Icon className="text-xl" />
                    <span className="text-sm">{option.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-base-200 rounded-lg">
              <p className="text-sm text-base-content opacity-70 mb-2">
                Enlace del marcador:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered input-sm flex-1 text-xs"
                  value={bookmarkUrl}
                  readOnly
                  onClick={(e) => e.target.select()}
                />
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
            <button>close</button>
          </div>
        </div>
      )}
    </>
  );
}

