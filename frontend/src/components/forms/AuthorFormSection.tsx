/**
 * AuthorFormSection
 *
 * Form component for author information input fields.
 * Handles author details: name, email, company, job title, and bio.
 * Includes validation and error display.
 */

import { COLORS } from "../../constants/config";

interface AuthorFormSectionProps {
  authorData: {
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    job_title: string;
    bio: string;
  };
  errors: {
    first_name: string;
    last_name: string;
    email: string;
  };
  onAuthorDataChange: (
    data: Partial<AuthorFormSectionProps["authorData"]>
  ) => void;
  onErrorChange: (errors: Partial<AuthorFormSectionProps["errors"]>) => void;
  firstInputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function AuthorFormSection({
  authorData,
  errors,
  onAuthorDataChange,
  onErrorChange,
  firstInputRef,
}: AuthorFormSectionProps) {
  return (
    <div
      className="space-y-3"
      role="group"
      aria-labelledby="author-section-label"
    >
      <label
        id="author-section-label"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Author *
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            ref={firstInputRef}
            type="text"
            value={authorData.first_name}
            onChange={(e) => {
              onAuthorDataChange({ first_name: e.target.value });
              if (errors.first_name) onErrorChange({ first_name: "" });
            }}
            onBlur={(e) => {
              if (!e.target.value.trim()) {
                onErrorChange({ first_name: "First name is required" });
              }
            }}
            placeholder="First Name"
            style={{
              borderColor: errors.first_name
                ? COLORS.errorBorder
                : COLORS.gray[300],
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.first_name && (
            <p
              id="first-name-error"
              className="text-xs text-red-600 mt-1"
              role="alert"
            >
              {errors.first_name}
            </p>
          )}
        </div>
        <div>
          <input
            type="text"
            value={authorData.last_name}
            onChange={(e) => {
              onAuthorDataChange({ last_name: e.target.value });
              if (errors.last_name) onErrorChange({ last_name: "" });
            }}
            onBlur={(e) => {
              if (!e.target.value.trim()) {
                onErrorChange({ last_name: "Last name is required" });
              }
            }}
            placeholder="Last Name"
            style={{
              borderColor: errors.last_name
                ? COLORS.errorBorder
                : COLORS.gray[300],
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.last_name && (
            <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>
          )}
        </div>
      </div>
      <div>
        <input
          type="email"
          value={authorData.email}
          onChange={(e) => {
            onAuthorDataChange({ email: e.target.value });
            if (errors.email) onErrorChange({ email: "" });
          }}
          onBlur={(e) => {
            const email = e.target.value.trim();
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              onErrorChange({ email: "Please enter a valid email" });
            }
          }}
          placeholder="Email"
          aria-label="Author email address"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          style={{
            borderColor: errors.email ? COLORS.errorBorder : COLORS.gray[300],
          }}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.email && (
          <p
            id="email-error"
            className="text-xs text-red-600 mt-1"
            role="alert"
          >
            {errors.email}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            value={authorData.company}
            onChange={(e) => onAuthorDataChange({ company: e.target.value })}
            placeholder="Company"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="text"
            value={authorData.job_title}
            onChange={(e) => onAuthorDataChange({ job_title: e.target.value })}
            placeholder="Job Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <textarea
          value={authorData.bio}
          onChange={(e) => onAuthorDataChange({ bio: e.target.value })}
          placeholder="Bio (Optional)"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  );
}
