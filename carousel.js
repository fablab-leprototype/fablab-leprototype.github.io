class Carousel3D {
  constructor() {
    this.carousel = document.querySelector('.carousel');
    this.items = document.querySelectorAll('.carousel-item');
    this.currentIndex = 0;
    this.totalItems = this.items.length;
    
    document.querySelector('.prev').addEventListener('click', () => this.rotate('prev'));
    document.querySelector('.next').addEventListener('click', () => this.rotate('next'));
    
    this.updateCarousel();
  }

  rotate(direction) {
    if (direction === 'next') {
      this.currentIndex = (this.currentIndex + 1) % this.totalItems;
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
    }
    this.updateCarousel();
  }

  updateCarousel() {
    for (let i = 0; i < this.totalItems; i++) {
      const angle = ((i - this.currentIndex) * (360 / this.totalItems));
      const translateZ = -500;
      this.items[i].style.transform = `
        rotateY(${angle}deg) 
        translateZ(${translateZ}px)
        ${Math.abs(angle) > 90 ? 'scale(0.8)' : 'scale(1)'}
      `;
      this.items[i].style.opacity = Math.abs(angle) > 90 ? '0.5' : '1';
    }
  }
}

// Initialiser le carrousel quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  new Carousel3D();
});