# Template Management App

This is an open source template management application that allows you to create, manage, and delete WhatsApp message templates using the Meta Graph API.

## Features

- **Template Creation**: Create WhatsApp message templates with support for:
  - Marketing templates
  - Utility templates  
  - Authentication templates
- **Template Management**: View, edit, and delete existing templates
- **Component Support**: Add headers, body text, footers, and buttons to templates
- **File Upload**: Upload media files for template headers using Meta's Resumable Upload API
- **Real-time Validation**: Built-in validation for template compliance with Meta's requirements

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Meta Graph API credentials (WhatsApp Business Account ID and Access Token)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure your Meta API credentials in `lib/api/TemplateService.ts`:
```typescript
const WhatsappBusinessAccountId = "YOUR_WABA_ID";
const WhatsappAppId = "YOUR_META_APP_ID";
const facebookAccessToken = "YOUR_ACCESS_TOKEN";
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Creating Templates

1. Click the "Create Template" button
2. Fill in the template details:
   - **Name**: Unique template name
   - **Language**: Template language code
   - **Category**: Choose from Marketing, Utility, or Authentication
3. Add components as needed:
   - **Header**: Text, image, video, or document (with file upload support)
   - **Body**: Main message content with variable support
   - **Footer**: Optional footer text
   - **Buttons**: URL, phone number, or quick reply buttons
4. Click "Create Template" to submit

### Managing Templates

- View all templates in the main dashboard
- Filter by status (All, Approved, Pending, Rejected)
- Delete templates using the trash icon
- Copy template content to clipboard

## File Upload Support

The app supports file uploads using Meta's Resumable Upload API:

- **Supported Formats**: PDF, JPEG, PNG, MP4
- **File Size Limits**: 
  - Images: 5MB max
  - Videos: 16MB max  
  - PDFs: 100MB max
- **Upload Process**: Uses Meta's 3-step resumable upload process
- **Resume Capability**: Interrupted uploads can be resumed

## Open Source Limitations

In open source mode, some features are limited:

- **WABA Integration**: Full WABA functionality requires the commercial version.

## API Integration

The app integrates with Meta's Graph API for:
- Creating message templates
- Fetching existing templates
- Deleting templates

## Development

### Project Structure

```
apps/template-management/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # API services and utilities
└── packages/               # Shared UI components
```

### Key Components

- `TemplateClient`: Main component managing template state
- `TemplateManager`: UI for displaying and managing templates
- `CreateTemplateUI`: Form for creating new templates
- `HeaderComponentEditor`: Editor for template headers
- `AuthenticationTemplateForm`: Specialized form for auth templates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
