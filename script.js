document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('capture-form');
    const whatsappInput = document.getElementById('whatsapp');
    const whatsappError = document.getElementById('whatsapp-error');
    
    // Máscara para o campo de WhatsApp
    whatsappInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            // Adiciona o DDD entre parênteses
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 7) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            } else {
                value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
            }
        }
        
        e.target.value = value;
    });
    
    // Validação do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const whatsapp = whatsappInput.value.replace(/\D/g, '');
        
        // Validar número de WhatsApp (deve ter 11 dígitos - com DDD)
        if (whatsapp.length !== 11) {
            whatsappError.textContent = 'Por favor, insira um número de WhatsApp válido com DDD';
            whatsappInput.focus();
            return;
        }
        
        whatsappError.textContent = '';
        
        // Preparar os dados para envio
        const formData = {
            whatsapp: whatsapp
        };
        
        // Envia os dados para o Google Apps Script
        saveToExcel(formData);
    });
    
    function saveToExcel(data) {
        fetch('https://script.google.com/macros/s/AKfycby9GfqPN-xN1PDqwsDgtiKs7efMOblVRBWVkByMLd-wkIqHPR-9dkBjtzXc9yrFPf5UPg/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'no-cors' // Modo no-cors para evitar problemas de CORS
        })
        .then(() => {
            // Exibe a mensagem de sucesso (não há resposta do servidor)
            form.innerHTML = `
                <div class="success-message">
                    <h3>🎉 Parabéns! Você está dentro!</h3>
                    <p>Vamos entrar em contato com você em breve pelo WhatsApp ${formatWhatsapp(data.whatsapp)}.</p>
                </div>
            `;
            
            // Animação para destacar a mensagem
            const successMessage = document.querySelector('.success-message');
            successMessage.style.animation = 'pulse 2s';
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            whatsappError.textContent = 'Ocorreu um erro ao enviar os dados. Tente novamente.';
        });
    }
    
    function formatWhatsapp(number) {
        return `(${number.substring(0, 2)}) ${number.substring(2, 7)}-${number.substring(7, 11)}`;
    }
    
    // Efeitos visuais adicionais
    document.querySelectorAll('.benefits li').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
    
    // Adicionar pequeno efeito ao botão
    const ctaButton = document.querySelector('.cta-button');
    
    setInterval(() => {
        ctaButton.classList.add('pulse');
        
        setTimeout(() => {
            ctaButton.classList.remove('pulse');
        }, 1000);
    }, 5000);
});

// Adicionar CSS para a animação
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 1s;
    }
    
    .success-message {
        text-align: center;
        padding: 2rem 0;
    }
    
    .success-message h3 {
        color: var(--color-primary);
        margin-bottom: 1rem;
    }
`;

document.head.appendChild(style);
