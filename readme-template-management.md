# WhatsApp Template Management

A comprehensive template management system for WhatsApp Business API message templates. This open-source tool provides an intuitive interface for creating, editing, approving, and managing WhatsApp message templates with advanced features for bulk operations and analytics.

## 🚀 Features

- **Template Editor**: Rich text editor with WhatsApp template syntax support
- **Bulk Operations**: Create, edit, and manage multiple templates at once
- **Approval Workflow**: Submit templates for WhatsApp approval with status tracking
- **Template Analytics**: Track template performance and usage statistics
- **Multi-language Support**: Create templates in multiple languages
- **Template Categories**: Organize templates by categories and use cases
- **Version Control**: Track template changes and maintain version history
- **Export/Import**: Export templates to JSON/CSV and import from external sources
- **Preview Mode**: Preview templates before submission
- **Template Library**: Pre-built template examples and best practices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **UI Framework**: React 19
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Build Tool**: Turbo
- **Rich Text Editor**: Tiptap
- **State Management**: Zustand

## 📦 Installation

### Prerequisites

- Node.js >= 20
- pnpm >= 10.15.0

### Setup

```bash
# Clone the repository
git clone https://github.com/sendzen-io/whatsapp-template-management.git

# Navigate to the project directory
cd whatsapp-template-management

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### Basic Template Creation

```tsx
import { TemplateEditor } from '@sendzen/ui-template-management'

function CreateTemplate() {
  const handleSave = (template) => {
    console.log('Template saved:', template)
  }

  return (
    <TemplateEditor
      onSave={handleSave}
      category="UTILITY"
      language="en_US"
    />
  )
}
```

### Advanced Template Management

```tsx
import { TemplateManager } from '@sendzen/ui-template-management'

function TemplateDashboard() {
  return (
    <TemplateManager
      features={{
        bulkOperations: true,
        analytics: true,
        versionControl: true,
        exportImport: true
      }}
      onTemplateUpdate={(template) => {
        // Handle template updates
      }}
      onBulkOperation={(operation, templates) => {
        // Handle bulk operations
      }}
    />
  )
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Template Management API
TEMPLATE_API_BASE_URL=https://api.sendzen.io/templates
TEMPLATE_API_KEY=your_template_api_key

# Optional: Database for template storage
DATABASE_URL=your_database_url_here

# Optional: File storage for media
STORAGE_BUCKET=your_storage_bucket
STORAGE_ACCESS_KEY=your_storage_access_key

# Optional: Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
```

### Template Configuration

```typescript
interface TemplateConfig {
  categories: TemplateCategory[]
  languages: Language[]
  maxTemplates: number
  approvalWorkflow: boolean
  autoSave: boolean
  versionControl: boolean
}
```

## 📝 Template Types

### 1. Text Templates
Simple text messages with optional parameters:

```
Hello {{1}}, your order #{{2}} has been confirmed. 
Expected delivery: {{3}}
```

### 2. Media Templates
Templates with images, videos, or documents:

```
🎉 Welcome to our store!

Check out our latest collection: {{1}}
```

### 3. Interactive Templates
Templates with buttons and quick replies:

```
Your appointment is confirmed for {{1}}

Please reply with:
• 1 - Confirm
• 2 - Reschedule
• 3 - Cancel
```

### 4. Location Templates
Templates for sharing location information:

```
📍 We're located at:

{{1}}

Directions: {{2}}
```

## 🎨 Template Editor Features

### Rich Text Editor
- **Bold/Italic**: Format text with WhatsApp-compatible formatting
- **Parameter Insertion**: Easy insertion of dynamic parameters
- **Emoji Support**: Full emoji picker and support
- **Character Count**: Real-time character counting
- **Preview Mode**: Live preview of template appearance

### Template Validation
- **Syntax Checking**: Validate template syntax before submission
- **Parameter Validation**: Ensure all parameters are properly formatted
- **Character Limits**: Enforce WhatsApp character limits
- **Content Guidelines**: Check against WhatsApp content policies

### Advanced Features
- **Template Cloning**: Clone existing templates for quick creation
- **Template Library**: Access to pre-built template examples
- **Auto-save**: Automatic saving of draft templates
- **Collaboration**: Multi-user template editing with conflict resolution

## 📊 Analytics & Reporting

### Template Performance Metrics
- **Usage Statistics**: Track how often templates are used
- **Delivery Rates**: Monitor template delivery success rates
- **Response Rates**: Track user responses to templates
- **Error Analysis**: Identify and analyze template failures

### Reporting Dashboard
- **Usage Trends**: Visual charts of template usage over time
- **Category Analysis**: Performance breakdown by template category
- **Language Analytics**: Usage statistics by language
- **Export Reports**: Export analytics data to CSV/PDF

## 🔄 Workflow Management

### Approval Process
1. **Draft Creation**: Create template in draft mode
2. **Internal Review**: Internal team review and approval
3. **WhatsApp Submission**: Submit to WhatsApp for approval
4. **Status Tracking**: Track approval status and feedback
5. **Live Deployment**: Deploy approved templates

### Status Tracking
- **Draft**: Template being created/edited
- **Under Review**: Template submitted for internal review
- **Pending Approval**: Submitted to WhatsApp for approval
- **Approved**: Template approved and ready for use
- **Rejected**: Template rejected with feedback
- **Archived**: Template no longer in use

## 🚀 Bulk Operations

### Bulk Template Creation
- **CSV Import**: Import templates from CSV files
- **Template Duplication**: Duplicate templates with modifications
- **Batch Processing**: Process multiple templates simultaneously

### Bulk Template Management
- **Bulk Edit**: Edit multiple templates at once
- **Bulk Delete**: Delete multiple templates
- **Bulk Status Update**: Update status of multiple templates
- **Bulk Export**: Export multiple templates to various formats

## 🌍 Multi-language Support

### Supported Languages
- English (`en_US`, `en_GB`)
- Spanish (`es_ES`, `es_MX`)
- French (`fr_FR`)
- German (`de_DE`)
- Italian (`it_IT`)
- Portuguese (`pt_BR`, `pt_PT`)
- Russian (`ru_RU`)
- Arabic (`ar_SA`)
- Chinese (`zh_CN`, `zh_TW`)
- Japanese (`ja_JP`)
- Korean (`ko_KR`)

### Language Management
- **Language Detection**: Automatic language detection
- **Translation Tools**: Built-in translation assistance
- **Language-specific Validation**: Validation rules per language
- **Cultural Adaptation**: Adapt templates for different cultures

## 📱 Mobile Support

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Touch-friendly**: Touch-optimized interface
- **Offline Support**: Work offline with sync capabilities
- **Progressive Web App**: Install as mobile app

### Mobile Features
- **Quick Actions**: Swipe gestures for quick operations
- **Voice Input**: Voice-to-text for template creation
- **Camera Integration**: Capture images for media templates
- **Push Notifications**: Real-time notifications for approvals

## 🔒 Security & Compliance

### Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Access Control**: Role-based access control
- **Audit Logs**: Comprehensive audit logging
- **Data Retention**: Configurable data retention policies

### WhatsApp Compliance
- **Content Policy**: Automatic content policy checking
- **Template Guidelines**: Enforce WhatsApp template guidelines
- **Rate Limiting**: Respect WhatsApp API rate limits
- **Error Handling**: Proper error handling and reporting

## 🧪 Testing

### Template Testing
```bash
# Run template validation tests
pnpm test:templates

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e
```

### Test Templates
The system includes test templates for development:
- Sample text templates
- Media template examples
- Interactive template samples
- Multi-language test templates

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Docker
```bash
# Build Docker image
docker build -t whatsapp-template-management .

# Run with Docker Compose
docker-compose up -d
```

### Self-hosted
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📚 API Reference

### Template API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/templates` | GET | List all templates |
| `/api/templates` | POST | Create new template |
| `/api/templates/{id}` | GET | Get specific template |
| `/api/templates/{id}` | PUT | Update template |
| `/api/templates/{id}` | DELETE | Delete template |
| `/api/templates/bulk` | POST | Bulk operations |
| `/api/templates/export` | GET | Export templates |
| `/api/templates/import` | POST | Import templates |

### Webhook Events

| Event | Description |
|-------|-------------|
| `template.created` | Template created |
| `template.updated` | Template updated |
| `template.deleted` | Template deleted |
| `template.approved` | Template approved |
| `template.rejected` | Template rejected |

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Add new features or fix bugs
4. **Run tests**: `pnpm test`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all linting passes
- Follow WhatsApp template guidelines

## 🐛 Troubleshooting

### Common Issues

**Template Approval Failures**
- Check template content against WhatsApp guidelines
- Verify parameter formatting
- Ensure proper template category
- Review character limits

**Bulk Import Issues**
- Check CSV format and headers
- Validate template syntax
- Verify language codes
- Check file size limits

**Performance Issues**
- Check database connection
- Monitor API rate limits
- Optimize template queries
- Clear cache if needed

### Getting Help

- Check the [Issues](https://github.com/sendzen-io/whatsapp-template-management/issues) page
- Review the [Discussions](https://github.com/sendzen-io/whatsapp-template-management/discussions) section
- Join our community Discord server
- Read the [FAQ](./docs/faq.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Rich text editor from [Tiptap](https://tiptap.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Powered by [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

## 📞 Support

- **Documentation**: [docs.sendzen.io](https://docs.sendzen.io)
- **Community**: [Discord](https://discord.gg/sendzen)
- **Email**: support@sendzen.io
- **Website**: [sendzen.io](https://sendzen.io)

---

**Made with ❤️ by the SendZen team**
