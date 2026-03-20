import type { Metadata } from 'next';
import { Building2, FileText, ListChecks, ClipboardList, CheckCircle2, Circle } from 'lucide-react';

export const metadata: Metadata = { title: 'Field Dictionary' };

interface Field {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface Entity {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  iconBg: string;
  fields: Field[];
}

const entities: Entity[] = [
  {
    name: 'Agency',
    description: 'A government agency that owns one or more services.',
    icon: Building2,
    color: 'text-violet-600',
    iconBg: 'bg-violet-50',
    fields: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Full official name of the agency.',
        example: 'Department of Foreign Affairs',
      },
      {
        name: 'acronym',
        type: 'string',
        required: true,
        description: 'Short alphanumeric code. Unique identifier used across the system.',
        example: 'DFA',
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description: 'Brief summary of what the agency does.',
        example: 'Handles passport issuance and foreign affairs.',
      },
      {
        name: 'website_url',
        type: 'url',
        required: false,
        description: 'Official agency website.',
        example: 'https://dfa.gov.ph',
      },
    ],
  },
  {
    name: 'Service',
    description: 'A specific government service offered by an agency (e.g., passport, birth certificate).',
    icon: FileText,
    color: 'text-blue-600',
    iconBg: 'bg-blue-50',
    fields: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Display name of the service.',
        example: 'New Passport Application',
      },
      {
        name: 'slug',
        type: 'string',
        required: true,
        description: 'URL-friendly identifier. Lowercase letters, numbers, and hyphens only. Auto-generated from name.',
        example: 'new-passport-application',
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description: 'What this service is about and who it is for.',
        example: 'Apply for a new Philippine passport for first-time applicants.',
      },
      {
        name: 'agency',
        type: 'select',
        required: true,
        description: 'The agency that offers this service.',
        example: 'DFA – Department of Foreign Affairs',
      },
      {
        name: 'estimated_time',
        type: 'string',
        required: false,
        description: 'How long the service usually takes to complete.',
        example: '10–15 working days',
      },
      {
        name: 'appointment_url',
        type: 'url',
        required: false,
        description: 'Link to the online appointment/booking page.',
        example: 'https://passport.gov.ph/appointment',
      },
      {
        name: 'is_active',
        type: 'boolean',
        required: false,
        description: 'Whether the service is visible to the public. Defaults to active.',
        example: 'true',
      },
    ],
  },
  {
    name: 'Step',
    description: 'An ordered step the applicant must complete as part of a service.',
    icon: ListChecks,
    color: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    fields: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Short label for the step. Should be action-oriented.',
        example: 'Fill out the application form',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Additional details or instructions for this step.',
        example: 'Download Form DFA-001 from the official website and fill in all required fields.',
      },
      {
        name: 'order',
        type: 'number',
        required: true,
        description: 'Position of this step in the sequence. Automatically assigned; adjustable via reorder.',
        example: '1',
      },
    ],
  },
  {
    name: 'Requirement',
    description: 'A document or item the applicant must bring or prepare for a specific step.',
    icon: ClipboardList,
    color: 'text-amber-600',
    iconBg: 'bg-amber-50',
    fields: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Name of the required document or item.',
        example: 'Valid Government-Issued ID',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'What the document is or additional context about it.',
        example: "Any government-issued photo ID such as SSS, GSIS, PhilHealth, or driver's license.",
      },
      {
        name: 'notes',
        type: 'string',
        required: false,
        description: 'Submission instructions or preparation notes.',
        example: 'Original + 1 photocopy (both sides)',
      },
      {
        name: 'is_optional',
        type: 'boolean',
        required: false,
        description: 'Whether this requirement can be skipped. Defaults to false (required).',
        example: 'false',
      },
    ],
  },
];

const typeColors: Record<string, string> = {
  string: 'bg-blue-50 text-blue-600',
  url: 'bg-purple-50 text-purple-600',
  number: 'bg-orange-50 text-orange-600',
  boolean: 'bg-teal-50 text-teal-600',
  select: 'bg-pink-50 text-pink-600',
};

export default function DictionaryPage() {
  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="font-display font-bold text-xl text-navy">Field Dictionary</h1>
        <p className="text-xs text-gray-400 mt-1">
          Reference guide for all fields when creating agencies, services, steps, and requirements.
        </p>
      </div>

      <div className="space-y-6">
        {entities.map((entity, ei) => {
          const Icon = entity.icon;
          return (
            <div
              key={entity.name}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${ei * 80 + 80}ms` }}
            >
              {/* Entity header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${entity.iconBg}`}>
                  <Icon className={`w-4 h-4 ${entity.color}`} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{entity.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{entity.description}</p>
                </div>
              </div>

              {/* Fields table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left px-5 py-2.5 font-medium text-gray-400 uppercase tracking-wide text-[10px] w-36">
                        Field
                      </th>
                      <th className="text-left px-3 py-2.5 font-medium text-gray-400 uppercase tracking-wide text-[10px] w-24">
                        Type
                      </th>
                      <th className="text-left px-3 py-2.5 font-medium text-gray-400 uppercase tracking-wide text-[10px] w-24">
                        Required
                      </th>
                      <th className="text-left px-3 py-2.5 font-medium text-gray-400 uppercase tracking-wide text-[10px]">
                        Description
                      </th>
                      <th className="text-left px-5 py-2.5 font-medium text-gray-400 uppercase tracking-wide text-[10px] w-56">
                        Example
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {entity.fields.map((field) => (
                      <tr key={field.name} className="hover:bg-gray-50/40 transition-colors duration-100">
                        <td className="px-5 py-3.5">
                          <code className="font-mono text-[11px] font-semibold text-navy/70 bg-navy/4 px-1.5 py-0.5 rounded-md">
                            {field.name}
                          </code>
                        </td>
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium ${typeColors[field.type] ?? 'bg-gray-100 text-gray-500'}`}
                          >
                            {field.type}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          {field.required ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="text-[10px] font-medium">Yes</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-300">
                              <Circle className="w-3 h-3" />
                              <span className="text-[10px] font-medium">Optional</span>
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3.5 text-gray-500 leading-relaxed">{field.description}</td>
                        <td className="px-5 py-3.5">
                          {field.example && <span className="text-[11px] text-gray-400 italic">{field.example}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
