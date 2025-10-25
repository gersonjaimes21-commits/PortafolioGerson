// ===== CONFIGURACIÓN INICIAL =====
// Esperar a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portafolio de Gerson Jaimes cargado correctamente');
    
    // Inicializar todas las funcionalidades
    initNavigation();
    initContactForm();
    initScrollEffects();
    initProjectButtons();
    initAnimations();
});

// ===== NAVEGACIÓN RESPONSIVE =====
function initNavigation() {
    // Obtener elementos del DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Función para alternar el menú móvil
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
    
    // Event listener para el botón hamburguesa
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navegación suave a secciones
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir comportamiento por defecto
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calcular posición considerando la navegación fija
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                // Scroll suave a la sección
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    // Obtener el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Event listener para el envío del formulario
        contactForm.addEventListener('submit', function(e) {
            // Obtener datos del formulario
            const formData = new FormData(contactForm);
            const nombre = formData.get('nombre');
            const correo = formData.get('correo');
            const mensaje = formData.get('mensaje');
            
            // Validar que todos los campos estén completos
            if (!nombre || !correo || !mensaje) {
                e.preventDefault();
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                e.preventDefault();
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Mostrar estado de carga
            const submitButton = document.querySelector('#contactForm button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // El formulario se enviará automáticamente a Formspree
            // Mostrar mensaje de éxito después de un breve delay
            setTimeout(() => {
                showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1000);
        });
    }
}


// Función para mostrar notificaciones
function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-family: 'Poppins', Arial, sans-serif;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
    // Efecto de transparencia en la navegación al hacer scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            navbar.style.background = 'rgba(16, 16, 125, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(16, 16, 125, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Animación de elementos al hacer scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.experience-card, .project-card, .skill-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ===== BOTONES DE PROYECTOS =====
function initProjectButtons() {
    // Obtener todos los botones de proyectos
    const projectButtons = document.querySelectorAll('.project-btn');
    
    projectButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Obtener información del proyecto
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            const projectDescription = projectCard.querySelector('.project-description').textContent;
            
            // Mostrar modal con información del proyecto
            showProjectModal(projectTitle, projectDescription);
        });
    });
}

// Función para mostrar modal de proyecto
function showProjectModal(title, description) {
    // Crear overlay del modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Crear contenido del modal
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.style.cssText = `
        background: linear-gradient(135deg, #1a1a9a, #10107D);
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        border: 1px solid rgba(235, 223, 225, 0.3);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #EBDFE1; margin-bottom: 1rem; font-size: 1.5rem;">${title}</h3>
        <p style="color: #E0DFEB; line-height: 1.6; margin-bottom: 2rem;">${description}</p>
        <div style="text-align: center;">
            <button class="btn btn-primary" onclick="closeModal()" style="margin-right: 1rem;">Cerrar</button>
            <button class="btn btn-secondary" onclick="contactAboutProject('${title}')">Contactar sobre este proyecto</button>
        </div>
    `;
    
    // Agregar elementos al DOM
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animar entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 100);
    
    // Cerrar modal al hacer clic en overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
}

// Función para cerrar modal
function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        const modal = overlay.querySelector('.modal-content');
        modal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

// Función para contactar sobre proyecto específico
function contactAboutProject(projectTitle) {
    closeModal();
    
    // Llenar automáticamente el campo de mensaje
    const mensajeField = document.getElementById('mensaje');
    if (mensajeField) {
        mensajeField.value = `Hola Gerson, me interesa conocer más detalles sobre el proyecto: ${projectTitle}. ¿Podrías proporcionarme más información?`;
    }
    
    // Scroll al formulario de contacto
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = contactSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== ANIMACIONES ADICIONALES =====
function initAnimations() {
    // Efecto de hover en tarjetas
    const cards = document.querySelectorAll('.experience-card, .project-card, .skill-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efecto de parallax suave en la imagen de perfil
    window.addEventListener('scroll', function() {
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            profileImg.style.transform = `translateY(${rate}px) scale(1)`;
        }
    });
    
    // Animación de escritura para el título principal
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = setInterval(() => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeWriter);
            }
        }, 100);
    }
}

// ===== UTILIDADES ADICIONALES =====
// Función para detectar si el usuario está en móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para ajustar animaciones según el dispositivo
function adjustAnimationsForDevice() {
    if (isMobile()) {
        // Reducir animaciones en móviles para mejor rendimiento
        const animatedElements = document.querySelectorAll('*');
        animatedElements.forEach(element => {
            element.style.transition = 'none';
        });
    }
}

// Ajustar animaciones al cargar
window.addEventListener('load', adjustAnimationsForDevice);

// Ajustar animaciones al redimensionar ventana
window.addEventListener('resize', adjustAnimationsForDevice);

// ===== EFECTOS DE CURSOR PERSONALIZADO =====
// Crear cursor personalizado (opcional)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg, #EBDFE1, #E5DFEB);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    
    document.body.appendChild(cursor);
    
    // Seguir cursor
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Efecto al hacer hover en elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .experience-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Inicializar cursor personalizado solo en desktop
if (!isMobile()) {
    initCustomCursor();
}

// ===== CONSOLA DE DESARROLLO =====
// Mensaje de bienvenida en consola
console.log('%c🚀 Portafolio de Gerson Jaimes', 'color: #EBDFE1; font-size: 20px; font-weight: bold;');
console.log('%c💼 Ingeniero Industrial', 'color: #E5DFEB; font-size: 16px;');
console.log('%c📧 Contacto: gerson.jaimes@email.com', 'color: #E0DFEB; font-size: 14px;');
console.log('%c🌟 ¡Gracias por visitar mi portafolio!', 'color: #EBDFE1; font-size: 14px;');