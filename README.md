# Dr. Naila Marir Portfolio

A modern, professional portfolio website for AI & Cybersecurity researcher with an integrated chatbot.

## 📁 File Structure

```
portfolio/
├── index.html           # Main HTML structure
├── style.css           # All styling and design
├── app.js              # JavaScript functionality
└── knowledge-base.json # Data source (all content)
```

## 🎯 Architecture

### 1. **knowledge-base.json** - The Data Layer
- Contains ALL information about Dr. Marir
- Personal info, education, experience, publications
- Research areas, skills, awards
- Chatbot responses
- Easy to update without touching code

### 2. **style.css** - The Design Layer
- Modern, clean design system
- Glassmorphism effects
- Gradient accents
- Responsive layout
- All visual styling separated from logic

### 3. **index.html** - The Structure Layer
- Semantic HTML structure
- Minimal inline content
- Dynamic content loaded from JSON
- Clean and maintainable

### 4. **app.js** - The Logic Layer
- Loads knowledge base dynamically
- Populates all page sections
- Handles chatbot interactions
- Smooth scrolling and animations
- Navbar scroll effects

## ✨ Features

- **Modular Design**: Separated concerns (data, style, structure, logic)
- **Easy Updates**: Change content in JSON without touching code
- **Chatbot**: Rule-based chatbot that reads from knowledge base
- **Responsive**: Works on all devices
- **Modern UI**: Glassmorphism, gradients, smooth animations
- **Fast Loading**: Optimized performance

## 🚀 How to Use

### Updating Content
Edit `knowledge-base.json` to update:
- Personal information
- Publications
- Research areas
- Skills
- Contact details
- Chatbot responses

### Customizing Design
Edit `style.css` to change:
- Colors (CSS variables at top)
- Fonts
- Spacing
- Animations
- Layout

### Adding Features
Edit `app.js` to add:
- New sections
- Interactive elements
- Enhanced chatbot logic
- Analytics

## 🎨 Color Scheme

```css
--primary-color: #0f172a   (Dark Navy)
--secondary-color: #3b82f6 (Blue)
--accent-color: #8b5cf6    (Purple)
```

## 📝 Chatbot Knowledge

The chatbot uses keyword matching from `chatbot_responses` in the JSON file. It can answer questions about:
- Research areas
- Education background
- Publications
- Skills and expertise
- Teaching experience
- Contact information
- Awards and achievements

## 🌐 Deployment

Upload all 4 files to your web hosting:
- Netlify: Drag and drop all files
- Vercel: Deploy via GitHub
- GitHub Pages: Push to repository
- Traditional hosting: Upload via FTP

Then connect your domain `www.nailamarir.com`

## 🔧 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🎯 Performance

- Lightweight (< 100KB total)
- Fast loading
- No external dependencies (except Google Fonts)
- Optimized images support

## 💡 Future Enhancements

To upgrade to a real LLM chatbot:
1. Set up backend API (Python/Node.js)
2. Integrate OpenAI/Anthropic API
3. Add API key management
4. Enable natural conversations

## 📄 License

© 2025 Dr. Naila Marir. All rights reserved.
