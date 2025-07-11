import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { EmojiSelectorComponent } from './app/emoji-selector/emoji-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, EmojiSelectorComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🎯 Seletor de Emoji</h1>
        <p>Clique no botão para abrir o seletor de emoji</p>
      </header>

      <main class="app-main">
        <div class="demo-section">
          <h2>Demonstração</h2>
          <div class="input-group">
            <input 
              type="text" 
              [(ngModel)]="message" 
              placeholder="Digite sua mensagem aqui..."
              class="message-input"
            />
            <button 
              (click)="openEmojiSelector()" 
              class="emoji-button"
              title="Abrir seletor de emoji"
            >
              😊
            </button>
          </div>
          
          <div class="message-preview" *ngIf="message">
            <h3>Prévia:</h3>
            <p class="preview-text">{{ message }}</p>
          </div>

          <div class="recent-emojis" *ngIf="recentEmojis.length > 0">
            <h3>Emojis Recentes:</h3>
            <div class="recent-grid">
              <button 
                *ngFor="let emoji of recentEmojis.slice(0, 10)" 
                (click)="addEmojiToMessage(emoji)"
                class="recent-emoji"
                [title]="'Adicionar ' + emoji"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>

        <div class="features-section">
          <h2>Funcionalidades</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Busca Inteligente</h3>
              <p>Encontre emojis rapidamente digitando palavras-chave</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Design Mobile</h3>
              <p>Interface otimizada para celulares e tablets</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎨</div>
              <h3>Categorias</h3>
              <p>Emojis organizados por categorias para fácil navegação</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Rápido</h3>
              <p>Carregamento instantâneo com animações suaves</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <app-emoji-selector
      *ngIf="showEmojiSelector"
      (emojiSelected)="onEmojiSelected($event)"
      (closeSelector)="closeEmojiSelector()"
    ></app-emoji-selector>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .app-header {
      text-align: center;
      color: white;
      margin-bottom: 40px;
    }

    .app-header h1 {
      font-size: 2.5rem;
      margin: 0 0 10px 0;
      font-weight: 700;
    }

    .app-header p {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
    }

    .app-main {
      max-width: 800px;
      margin: 0 auto;
    }

    .demo-section {
      background: white;
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .demo-section h2 {
      color: #1f2937;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .message-input {
      flex: 1;
      padding: 15px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .message-input:focus {
      border-color: #667eea;
    }

    .emoji-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      padding: 15px 20px;
      border-radius: 12px;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .emoji-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .emoji-button:active {
      transform: translateY(0);
    }

    .message-preview {
      margin-top: 20px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .message-preview h3 {
      margin: 0 0 10px 0;
      color: #374151;
      font-size: 1.1rem;
    }

    .preview-text {
      margin: 0;
      font-size: 1.2rem;
      line-height: 1.6;
      word-wrap: break-word;
    }

    .recent-emojis {
      margin-top: 20px;
    }

    .recent-emojis h3 {
      margin: 0 0 15px 0;
      color: #374151;
      font-size: 1.1rem;
    }

    .recent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
      gap: 10px;
      max-width: 600px;
    }

    .recent-emoji {
      background: #f3f4f6;
      border: none;
      padding: 10px;
      border-radius: 12px;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .recent-emoji:hover {
      background: #e5e7eb;
      transform: scale(1.1);
    }

    .features-section {
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .features-section h2 {
      color: #1f2937;
      margin-bottom: 25px;
      font-size: 1.5rem;
      text-align: center;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .feature-card {
      text-align: center;
      padding: 20px;
      border-radius: 12px;
      background: #f9fafb;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 2rem;
      margin-bottom: 15px;
    }

    .feature-card h3 {
      color: #1f2937;
      margin: 0 0 10px 0;
      font-size: 1.2rem;
    }

    .feature-card p {
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .app-container {
        padding: 15px;
      }

      .app-header h1 {
        font-size: 2rem;
      }

      .demo-section, .features-section {
        padding: 20px;
      }

      .input-group {
        flex-direction: column;
      }

      .message-input {
        margin-bottom: 10px;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class App {
  message = '';
  showEmojiSelector = false;
  recentEmojis: string[] = [];

  openEmojiSelector() {
    this.showEmojiSelector = true;
  }

  closeEmojiSelector() {
    this.showEmojiSelector = false;
  }

  onEmojiSelected(emoji: string) {
    this.addEmojiToMessage(emoji);
    this.addToRecentEmojis(emoji);
    this.closeEmojiSelector();
  }

  addEmojiToMessage(emoji: string) {
    this.message += emoji;
  }

  addToRecentEmojis(emoji: string) {
    // Remove emoji if already exists
    this.recentEmojis = this.recentEmojis.filter(e => e !== emoji);
    // Add to beginning
    this.recentEmojis.unshift(emoji);
    // Keep only 20 most recent
    this.recentEmojis = this.recentEmojis.slice(0, 20);
  }
}

bootstrapApplication(App, {
  providers: [provideHttpClient()]
});