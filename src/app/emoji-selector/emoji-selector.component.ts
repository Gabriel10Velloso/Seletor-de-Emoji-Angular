import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Emoji {
  name: string;
  category: string;
  group: string;
  htmlCode: string[];
  unicode: string[];
}

@Component({
  selector: 'app-emoji-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './emoji-selector.component.html',
  styleUrls: ['./emoji-selector.component.css']
})
export class EmojiSelectorComponent implements OnInit {
  @Output() emojiSelected = new EventEmitter<string>();
  @Output() closeSelector = new EventEmitter<void>();

  emojis: Emoji[] = [];
  filteredEmojis: Emoji[] = [];
  categories: string[] = [];
  selectedCategory: string = 'smileys-emotion';
  isLoading: boolean = true;
  searchTerm: string = '';

  // Categorias traduzidas
  categoryLabels: { [key: string]: string } = {
    'smileys-emotion': 'Rostos & Emoções',
    'people-body': 'Pessoas & Corpo',
    'animals-nature': 'Animais & Natureza',
    'food-drink': 'Comida & Bebida',
    'activities': 'Atividades',
    'travel-places': 'Viagem & Lugares',
    'objects': 'Objetos',
    'symbols': 'Símbolos',
    'flags': 'Bandeiras'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEmojis();
  }

  loadEmojis() {
    // Usando emojis estáticos organizados por categoria
    this.loadFallbackEmojis();
    this.isLoading = false;
  }

  loadFallbackEmojis() {
    const fallbackEmojis = [
      // Smileys & Emotion
      { name: 'rosto sorridente', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😀'], unicode: ['U+1F600'] },
      { name: 'rosto com olhos grandes', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😃'], unicode: ['U+1F603'] },
      { name: 'rosto sorridente com olhos sorridentes', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😄'], unicode: ['U+1F604'] },
      { name: 'rosto radiante', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😆'], unicode: ['U+1F606'] },
      { name: 'rosto com suor', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😅'], unicode: ['U+1F605'] },
      { name: 'rolando no chão de rir', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤣'], unicode: ['U+1F923'] },
      { name: 'rosto com lágrimas de alegria', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😂'], unicode: ['U+1F602'] },
      { name: 'rosto piscando', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😉'], unicode: ['U+1F609'] },
      { name: 'rosto sorridente', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😊'], unicode: ['U+1F60A'] },
      { name: 'rosto apaixonado', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😍'], unicode: ['U+1F60D'] },
      { name: 'rosto deslumbrado', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤩'], unicode: ['U+1F929'] },
      { name: 'mandando beijo', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😘'], unicode: ['U+1F618'] },
      { name: 'rosto beijando', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😗'], unicode: ['U+1F617'] },
      { name: 'rosto pensativo', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤔'], unicode: ['U+1F914'] },
      { name: 'rosto com sobrancelha levantada', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤨'], unicode: ['U+1F928'] },
      { name: 'rosto neutro', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😐'], unicode: ['U+1F610'] },
      { name: 'rosto sem expressão', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😑'], unicode: ['U+1F611'] },
      { name: 'rosto sem boca', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😶'], unicode: ['U+1F636'] },
      { name: 'rosto malicioso', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😏'], unicode: ['U+1F60F'] },
      { name: 'rosto aborrecido', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😒'], unicode: ['U+1F612'] },
      { name: 'rosto revirando os olhos', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🙄'], unicode: ['U+1F644'] },
      { name: 'rosto fazendo careta', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😬'], unicode: ['U+1F62C'] },
      { name: 'rosto mentiroso', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤥'], unicode: ['U+1F925'] },
      { name: 'rosto aliviado', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😌'], unicode: ['U+1F60C'] },
      { name: 'rosto pensativo', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😔'], unicode: ['U+1F614'] },
      { name: 'rosto com sono', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😪'], unicode: ['U+1F62A'] },
      { name: 'rosto babando', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤤'], unicode: ['U+1F924'] },
      { name: 'rosto dormindo', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😴'], unicode: ['U+1F634'] },
      { name: 'rosto com máscara', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😷'], unicode: ['U+1F637'] },
      { name: 'rosto com febre', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤒'], unicode: ['U+1F912'] },
      { name: 'rosto com curativo', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤕'], unicode: ['U+1F915'] },
      { name: 'rosto enjoado', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤢'], unicode: ['U+1F922'] },
      { name: 'rosto vomitando', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤮'], unicode: ['U+1F92E'] },
      { name: 'rosto espirrando', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤧'], unicode: ['U+1F927'] },
      { name: 'rosto com calor', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🥵'], unicode: ['U+1F975'] },
      { name: 'rosto com frio', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🥶'], unicode: ['U+1F976'] },
      { name: 'rosto tonto', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🥴'], unicode: ['U+1F974'] },
      { name: 'rosto zonzo', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['😵'], unicode: ['U+1F635'] },
      { name: 'cabeça explodindo', category: 'smileys-emotion', group: 'smileys-emotion', htmlCode: ['🤯'], unicode: ['U+1F92F'] },
      
      // People & Body
      { name: 'acenando', category: 'people-body', group: 'people-body', htmlCode: ['👋'], unicode: ['U+1F44B'] },
      { name: 'mão levantada', category: 'people-body', group: 'people-body', htmlCode: ['🤚'], unicode: ['U+1F91A'] },
      { name: 'mão com dedos abertos', category: 'people-body', group: 'people-body', htmlCode: ['🖐️'], unicode: ['U+1F590'] },
      { name: 'mão levantada', category: 'people-body', group: 'people-body', htmlCode: ['✋'], unicode: ['U+270B'] },
      { name: 'saudação vulcana', category: 'people-body', group: 'people-body', htmlCode: ['🖖'], unicode: ['U+1F596'] },
      { name: 'sinal de OK', category: 'people-body', group: 'people-body', htmlCode: ['👌'], unicode: ['U+1F44C'] },
      { name: 'dedos beliscando', category: 'people-body', group: 'people-body', htmlCode: ['🤌'], unicode: ['U+1F90C'] },
      { name: 'sinal de vitória', category: 'people-body', group: 'people-body', htmlCode: ['✌️'], unicode: ['U+270C'] },
      { name: 'dedos cruzados', category: 'people-body', group: 'people-body', htmlCode: ['🤞'], unicode: ['U+1F91E'] },
      { name: 'gesto de amor', category: 'people-body', group: 'people-body', htmlCode: ['🤟'], unicode: ['U+1F91F'] },
      { name: 'sinal de rock', category: 'people-body', group: 'people-body', htmlCode: ['🤘'], unicode: ['U+1F918'] },
      { name: 'me liga', category: 'people-body', group: 'people-body', htmlCode: ['🤙'], unicode: ['U+1F919'] },
      { name: 'apontando esquerda', category: 'people-body', group: 'people-body', htmlCode: ['👈'], unicode: ['U+1F448'] },
      { name: 'apontando direita', category: 'people-body', group: 'people-body', htmlCode: ['👉'], unicode: ['U+1F449'] },
      { name: 'apontando para cima', category: 'people-body', group: 'people-body', htmlCode: ['👆'], unicode: ['U+1F446'] },
      { name: 'dedo do meio', category: 'people-body', group: 'people-body', htmlCode: ['🖕'], unicode: ['U+1F595'] },
      { name: 'apontando para baixo', category: 'people-body', group: 'people-body', htmlCode: ['👇'], unicode: ['U+1F447'] },
      { name: 'indicador para cima', category: 'people-body', group: 'people-body', htmlCode: ['☝️'], unicode: ['U+261D'] },
      { name: 'polegar para cima', category: 'people-body', group: 'people-body', htmlCode: ['👍'], unicode: ['U+1F44D'] },
      { name: 'polegar para baixo', category: 'people-body', group: 'people-body', htmlCode: ['👎'], unicode: ['U+1F44E'] },
      { name: 'punho levantado', category: 'people-body', group: 'people-body', htmlCode: ['✊'], unicode: ['U+270A'] },
      { name: 'punho chegando', category: 'people-body', group: 'people-body', htmlCode: ['👊'], unicode: ['U+1F44A'] },
      { name: 'punho esquerdo', category: 'people-body', group: 'people-body', htmlCode: ['🤛'], unicode: ['U+1F91B'] },
      { name: 'punho direito', category: 'people-body', group: 'people-body', htmlCode: ['🤜'], unicode: ['U+1F91C'] },
      { name: 'batendo palmas', category: 'people-body', group: 'people-body', htmlCode: ['👏'], unicode: ['U+1F44F'] },
      { name: 'levantando as mãos', category: 'people-body', group: 'people-body', htmlCode: ['🙌'], unicode: ['U+1F64C'] },
      { name: 'mãos abertas', category: 'people-body', group: 'people-body', htmlCode: ['👐'], unicode: ['U+1F450'] },
      { name: 'palmas juntas para cima', category: 'people-body', group: 'people-body', htmlCode: ['🤲'], unicode: ['U+1F932'] },
      { name: 'aperto de mão', category: 'people-body', group: 'people-body', htmlCode: ['🤝'], unicode: ['U+1F91D'] },
      { name: 'mãos em oração', category: 'people-body', group: 'people-body', htmlCode: ['🙏'], unicode: ['U+1F64F'] },
      
      // Animals & Nature
      { name: 'rosto de cachorro', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐶'], unicode: ['U+1F436'] },
      { name: 'rosto de gato', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐱'], unicode: ['U+1F431'] },
      { name: 'rosto de rato', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐭'], unicode: ['U+1F42D'] },
      { name: 'rosto de hamster', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐹'], unicode: ['U+1F439'] },
      { name: 'rosto de coelho', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐰'], unicode: ['U+1F430'] },
      { name: 'rosto de raposa', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🦊'], unicode: ['U+1F98A'] },
      { name: 'rosto de urso', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐻'], unicode: ['U+1F43B'] },
      { name: 'rosto de panda', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐼'], unicode: ['U+1F43C'] },
      { name: 'coala', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐨'], unicode: ['U+1F428'] },
      { name: 'rosto de tigre', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐯'], unicode: ['U+1F42F'] },
      { name: 'rosto de leão', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🦁'], unicode: ['U+1F981'] },
      { name: 'rosto de vaca', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐮'], unicode: ['U+1F42E'] },
      { name: 'rosto de porco', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐷'], unicode: ['U+1F437'] },
      { name: 'rosto de sapo', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐸'], unicode: ['U+1F438'] },
      { name: 'rosto de macaco', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐵'], unicode: ['U+1F435'] },
      { name: 'macaco não vê', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🙈'], unicode: ['U+1F648'] },
      { name: 'macaco não ouve', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🙉'], unicode: ['U+1F649'] },
      { name: 'macaco não fala', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🙊'], unicode: ['U+1F64A'] },
      { name: 'rosto de unicórnio', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🦄'], unicode: ['U+1F984'] },
      { name: 'rosto de cavalo', category: 'animals-nature', group: 'animals-nature', htmlCode: ['🐴'], unicode: ['U+1F434'] },
      
      // Food & Drink
      { name: 'maçã vermelha', category: 'food-drink', group: 'food-drink', htmlCode: ['🍎'], unicode: ['U+1F34E'] },
      { name: 'maçã verde', category: 'food-drink', group: 'food-drink', htmlCode: ['🍏'], unicode: ['U+1F34F'] },
      { name: 'pêra', category: 'food-drink', group: 'food-drink', htmlCode: ['🍐'], unicode: ['U+1F350'] },
      { name: 'tangerina', category: 'food-drink', group: 'food-drink', htmlCode: ['🍊'], unicode: ['U+1F34A'] },
      { name: 'limão', category: 'food-drink', group: 'food-drink', htmlCode: ['🍋'], unicode: ['U+1F34B'] },
      { name: 'banana', category: 'food-drink', group: 'food-drink', htmlCode: ['🍌'], unicode: ['U+1F34C'] },
      { name: 'melancia', category: 'food-drink', group: 'food-drink', htmlCode: ['🍉'], unicode: ['U+1F349'] },
      { name: 'uvas', category: 'food-drink', group: 'food-drink', htmlCode: ['🍇'], unicode: ['U+1F347'] },
      { name: 'morango', category: 'food-drink', group: 'food-drink', htmlCode: ['🍓'], unicode: ['U+1F353'] },
      { name: 'melão', category: 'food-drink', group: 'food-drink', htmlCode: ['🍈'], unicode: ['U+1F348'] },
      { name: 'cerejas', category: 'food-drink', group: 'food-drink', htmlCode: ['🍒'], unicode: ['U+1F352'] },
      { name: 'pêssego', category: 'food-drink', group: 'food-drink', htmlCode: ['🍑'], unicode: ['U+1F351'] },
      { name: 'abacaxi', category: 'food-drink', group: 'food-drink', htmlCode: ['🍍'], unicode: ['U+1F34D'] },
      { name: 'coco', category: 'food-drink', group: 'food-drink', htmlCode: ['🥥'], unicode: ['U+1F965'] },
      { name: 'kiwi', category: 'food-drink', group: 'food-drink', htmlCode: ['🥝'], unicode: ['U+1F95D'] },
      { name: 'manga', category: 'food-drink', group: 'food-drink', htmlCode: ['🥭'], unicode: ['U+1F96D'] },
      { name: 'abacate', category: 'food-drink', group: 'food-drink', htmlCode: ['🥑'], unicode: ['U+1F951'] },
      { name: 'tomate', category: 'food-drink', group: 'food-drink', htmlCode: ['🍅'], unicode: ['U+1F345'] },
      { name: 'berinjela', category: 'food-drink', group: 'food-drink', htmlCode: ['🍆'], unicode: ['U+1F346'] },
      { name: 'cenoura', category: 'food-drink', group: 'food-drink', htmlCode: ['🥕'], unicode: ['U+1F955'] },
      { name: 'milho', category: 'food-drink', group: 'food-drink', htmlCode: ['🌽'], unicode: ['U+1F33D'] },
      { name: 'pimenta', category: 'food-drink', group: 'food-drink', htmlCode: ['🌶️'], unicode: ['U+1F336'] },
      { name: 'pepino', category: 'food-drink', group: 'food-drink', htmlCode: ['🥒'], unicode: ['U+1F952'] },
      { name: 'brócolis', category: 'food-drink', group: 'food-drink', htmlCode: ['🥦'], unicode: ['U+1F966'] },
      { name: 'cogumelo', category: 'food-drink', group: 'food-drink', htmlCode: ['🍄'], unicode: ['U+1F344'] },
      { name: 'amendoim', category: 'food-drink', group: 'food-drink', htmlCode: ['🥜'], unicode: ['U+1F95C'] },
      { name: 'castanha', category: 'food-drink', group: 'food-drink', htmlCode: ['🌰'], unicode: ['U+1F330'] },
      { name: 'pão', category: 'food-drink', group: 'food-drink', htmlCode: ['🍞'], unicode: ['U+1F35E'] },
      { name: 'croissant', category: 'food-drink', group: 'food-drink', htmlCode: ['🥐'], unicode: ['U+1F950'] },
      { name: 'baguete', category: 'food-drink', group: 'food-drink', htmlCode: ['🥖'], unicode: ['U+1F956'] },
      { name: 'pretzel', category: 'food-drink', group: 'food-drink', htmlCode: ['🥨'], unicode: ['U+1F968'] },
      { name: 'bagel', category: 'food-drink', group: 'food-drink', htmlCode: ['🥯'], unicode: ['U+1F96F'] },
      { name: 'panquecas', category: 'food-drink', group: 'food-drink', htmlCode: ['🥞'], unicode: ['U+1F95E'] },
      { name: 'waffle', category: 'food-drink', group: 'food-drink', htmlCode: ['🧇'], unicode: ['U+1F9C7'] },
      { name: 'queijo', category: 'food-drink', group: 'food-drink', htmlCode: ['🧀'], unicode: ['U+1F9C0'] },
      { name: 'hambúrguer', category: 'food-drink', group: 'food-drink', htmlCode: ['🍔'], unicode: ['U+1F354'] },
      { name: 'batata frita', category: 'food-drink', group: 'food-drink', htmlCode: ['🍟'], unicode: ['U+1F35F'] },
      { name: 'pizza', category: 'food-drink', group: 'food-drink', htmlCode: ['🍕'], unicode: ['U+1F355'] },
      { name: 'cachorro-quente', category: 'food-drink', group: 'food-drink', htmlCode: ['🌭'], unicode: ['U+1F32D'] },
      { name: 'sanduíche', category: 'food-drink', group: 'food-drink', htmlCode: ['🥪'], unicode: ['U+1F96A'] },
      { name: 'taco', category: 'food-drink', group: 'food-drink', htmlCode: ['🌮'], unicode: ['U+1F32E'] },
      { name: 'burrito', category: 'food-drink', group: 'food-drink', htmlCode: ['🌯'], unicode: ['U+1F32F'] },
      { name: 'sorvete', category: 'food-drink', group: 'food-drink', htmlCode: ['🍦'], unicode: ['U+1F366'] },
      { name: 'raspadinha', category: 'food-drink', group: 'food-drink', htmlCode: ['🍧'], unicode: ['U+1F367'] },
      { name: 'sorvete', category: 'food-drink', group: 'food-drink', htmlCode: ['🍨'], unicode: ['U+1F368'] },
      { name: 'rosquinha', category: 'food-drink', group: 'food-drink', htmlCode: ['🍩'], unicode: ['U+1F369'] },
      { name: 'biscoito', category: 'food-drink', group: 'food-drink', htmlCode: ['🍪'], unicode: ['U+1F36A'] },
      { name: 'bolo de aniversário', category: 'food-drink', group: 'food-drink', htmlCode: ['🎂'], unicode: ['U+1F382'] },
      { name: 'bolo', category: 'food-drink', group: 'food-drink', htmlCode: ['🍰'], unicode: ['U+1F370'] },
      { name: 'cupcake', category: 'food-drink', group: 'food-drink', htmlCode: ['🧁'], unicode: ['U+1F9C1'] },
      { name: 'torta', category: 'food-drink', group: 'food-drink', htmlCode: ['🥧'], unicode: ['U+1F967'] },
      { name: 'barra de chocolate', category: 'food-drink', group: 'food-drink', htmlCode: ['🍫'], unicode: ['U+1F36B'] },
      { name: 'doce', category: 'food-drink', group: 'food-drink', htmlCode: ['🍬'], unicode: ['U+1F36C'] },
      { name: 'pirulito', category: 'food-drink', group: 'food-drink', htmlCode: ['🍭'], unicode: ['U+1F36D'] },
      { name: 'pudim', category: 'food-drink', group: 'food-drink', htmlCode: ['🍮'], unicode: ['U+1F36E'] },
      { name: 'pote de mel', category: 'food-drink', group: 'food-drink', htmlCode: ['🍯'], unicode: ['U+1F36F'] },
      { name: 'mamadeira', category: 'food-drink', group: 'food-drink', htmlCode: ['🍼'], unicode: ['U+1F37C'] },
      { name: 'copo de leite', category: 'food-drink', group: 'food-drink', htmlCode: ['🥛'], unicode: ['U+1F95B'] },
      { name: 'bebida quente', category: 'food-drink', group: 'food-drink', htmlCode: ['☕'], unicode: ['U+2615'] },
      { name: 'chá', category: 'food-drink', group: 'food-drink', htmlCode: ['🍵'], unicode: ['U+1F375'] },
      { name: 'saquê', category: 'food-drink', group: 'food-drink', htmlCode: ['🍶'], unicode: ['U+1F376'] },
      { name: 'champanhe', category: 'food-drink', group: 'food-drink', htmlCode: ['🍾'], unicode: ['U+1F37E'] },
      { name: 'taça de vinho', category: 'food-drink', group: 'food-drink', htmlCode: ['🍷'], unicode: ['U+1F377'] },
      { name: 'coquetel', category: 'food-drink', group: 'food-drink', htmlCode: ['🍸'], unicode: ['U+1F378'] },
      { name: 'drink tropical', category: 'food-drink', group: 'food-drink', htmlCode: ['🍹'], unicode: ['U+1F379'] },
      { name: 'caneca de cerveja', category: 'food-drink', group: 'food-drink', htmlCode: ['🍺'], unicode: ['U+1F37A'] },
      { name: 'brinde cerveja', category: 'food-drink', group: 'food-drink', htmlCode: ['🍻'], unicode: ['U+1F37B'] },
      { name: 'brinde taças', category: 'food-drink', group: 'food-drink', htmlCode: ['🥂'], unicode: ['U+1F942'] },
      { name: 'copo de whisky', category: 'food-drink', group: 'food-drink', htmlCode: ['🥃'], unicode: ['U+1F943'] },
      
      // Activities
      { name: 'bola de futebol', category: 'activities', group: 'activities', htmlCode: ['⚽'], unicode: ['U+26BD'] },
      { name: 'basquete', category: 'activities', group: 'activities', htmlCode: ['🏀'], unicode: ['U+1F3C0'] },
      { name: 'futebol americano', category: 'activities', group: 'activities', htmlCode: ['🏈'], unicode: ['U+1F3C8'] },
      { name: 'baseball', category: 'activities', group: 'activities', htmlCode: ['⚾'], unicode: ['U+26BE'] },
      { name: 'tênis', category: 'activities', group: 'activities', htmlCode: ['🎾'], unicode: ['U+1F3BE'] },
      { name: 'boliche', category: 'activities', group: 'activities', htmlCode: ['🎳'], unicode: ['U+1F3B3'] },
      { name: 'pingue-pongue', category: 'activities', group: 'activities', htmlCode: ['🏓'], unicode: ['U+1F3D3'] },
      { name: 'badminton', category: 'activities', group: 'activities', htmlCode: ['🏸'], unicode: ['U+1F3F8'] },
      { name: 'luva de boxe', category: 'activities', group: 'activities', htmlCode: ['🥊'], unicode: ['U+1F94A'] },
      { name: 'uniforme artes marciais', category: 'activities', group: 'activities', htmlCode: ['🥋'], unicode: ['U+1F94B'] },
      { name: 'golfe', category: 'activities', group: 'activities', htmlCode: ['⛳'], unicode: ['U+26F3'] },
      { name: 'patins de gelo', category: 'activities', group: 'activities', htmlCode: ['⛸️'], unicode: ['U+26F8'] },
      { name: 'vara de pescar', category: 'activities', group: 'activities', htmlCode: ['🎣'], unicode: ['U+1F3A3'] },
      { name: 'máscara de mergulho', category: 'activities', group: 'activities', htmlCode: ['🤿'], unicode: ['U+1F93F'] },
      { name: 'esquis', category: 'activities', group: 'activities', htmlCode: ['🎿'], unicode: ['U+1F3BF'] },
      { name: 'trenó', category: 'activities', group: 'activities', htmlCode: ['🛷'], unicode: ['U+1F6F7'] },
      { name: 'alvo', category: 'activities', group: 'activities', htmlCode: ['🎯'], unicode: ['U+1F3AF'] },
      { name: 'ioiô', category: 'activities', group: 'activities', htmlCode: ['🪀'], unicode: ['U+1FA80'] },
      { name: 'pipa', category: 'activities', group: 'activities', htmlCode: ['🪁'], unicode: ['U+1FA81'] },
      { name: 'jogos de tabuleiro', category: 'activities', group: 'activities', htmlCode: ['🎲'], unicode: ['U+1F3B2'] }
    ];

    this.emojis = fallbackEmojis;
    this.categories = [...new Set(fallbackEmojis.map(emoji => emoji.group))];
    this.filterByCategory(this.selectedCategory);
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filteredEmojis = this.emojis.filter(emoji => emoji.group === category);
    this.searchTerm = '';
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.filteredEmojis = this.emojis.filter(emoji =>
        emoji.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filterByCategory(this.selectedCategory);
    }
  }

  selectEmoji(emoji: Emoji) {
    this.emojiSelected.emit(emoji.htmlCode[0]);
  }

  closePicker() {
    this.closeSelector.emit();
  }
}