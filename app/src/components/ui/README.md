# UI Components

## InfoTooltip

Componente tooltip inline per aggiungere informazioni contestuali a qualsiasi elemento.

### Props

```typescript
interface InfoTooltipProps {
  content: string              // Testo del tooltip
  position?: 'top' | 'bottom' | 'left' | 'right'  // Posizione (default: 'top')
  className?: string          // Classi CSS aggiuntive
}
```

### Usage

```tsx
import InfoTooltip from '@/components/ui/InfoTooltip'

// Base usage
<InfoTooltip content="Informazione utile" />

// With custom position
<InfoTooltip
  content="Il punteggio è calcolato su 3 fattori..."
  position="bottom"
/>

// Inline with text
<div className="flex items-center gap-2">
  <span>Compliance Score</span>
  <InfoTooltip content="Come viene calcolato..." />
</div>
```

### Features

- **Responsive**: Hover su desktop, click su mobile
- **Dark Mode**: Supporto nativo
- **Accessible**: ARIA labels, focus management, keyboard navigation
- **Animated**: Fade-in smooth con animazioni Tailwind
- **Posizionamento**: Auto-positioning con freccia direzionale

### Accessibility

- `role="tooltip"` sul contenuto
- `aria-label="Informazioni aggiuntive"` sul button
- Focus visibile con ring
- Keyboard accessible (focus/blur)

### Performance

- Client component con useState
- Event handlers ottimizzati
- Zero dependencies esterne
- Lightweight (< 3KB)

## Difference from PageInfoTooltip

- **InfoTooltip**: Piccolo, inline, per info contestuali su singoli elementi
- **PageInfoTooltip**: Più grande, per info a livello di pagina con title + description + tips

Use **InfoTooltip** when: singolo campo, metrica, icona
Use **PageInfoTooltip** when: header di pagina, sezione complessa
