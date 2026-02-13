import { useState, useEffect, useCallback, useMemo } from 'react';
import { SUPPORTED_LANGUAGES, Language } from '@/constants/languages';

const CUSTOM_LANGUAGES_KEY = 'speakr_custom_languages';

interface CustomLanguagesHook {
  allLanguages: Language[];
  addCustomLanguage: (name: string) => { success: boolean; error?: string };
  getLanguageLabel: (code: string) => string;
}

// Generate a stable code from a language name
function generateLanguageCode(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 10);
}

// Normalize language name for comparison
function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

// Sort languages alphabetically by label (case-insensitive)
function sortLanguages(languages: Language[]): Language[] {
  return [...languages].sort((a, b) => {
    const labelA = a.label.toLowerCase();
    const labelB = b.label.toLowerCase();
    return labelA.localeCompare(labelB);
  });
}

export function useCustomLanguages(): CustomLanguagesHook {
  const [customLanguages, setCustomLanguages] = useState<Language[]>([]);

  // Load custom languages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_LANGUAGES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomLanguages(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load custom languages:', error);
    }
  }, []);

  // Save custom languages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_LANGUAGES_KEY, JSON.stringify(customLanguages));
    } catch (error) {
      console.error('Failed to save custom languages:', error);
    }
  }, [customLanguages]);

  // Combine built-in and custom languages, then sort alphabetically
  const allLanguages = useMemo(() => {
    const combined = [...SUPPORTED_LANGUAGES, ...customLanguages];
    return sortLanguages(combined);
  }, [customLanguages]);

  // Add a custom language with duplicate detection
  const addCustomLanguage = useCallback((name: string): { success: boolean; error?: string } => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return { success: false, error: 'Language name cannot be empty' };
    }

    const normalizedInput = normalizeName(trimmedName);

    // Check against built-in languages
    const builtInMatch = SUPPORTED_LANGUAGES.find(
      lang => normalizeName(lang.label) === normalizedInput
    );
    if (builtInMatch) {
      return { success: false, error: `"${builtInMatch.label}" is already available in the list` };
    }

    // Check against custom languages
    const customMatch = customLanguages.find(
      lang => normalizeName(lang.label) === normalizedInput
    );
    if (customMatch) {
      return { success: false, error: `"${customMatch.label}" has already been added` };
    }

    // Create new custom language
    const code = `custom_${generateLanguageCode(trimmedName)}`;
    const newLanguage: Language = {
      code,
      label: trimmedName,
    };

    setCustomLanguages(prev => [...prev, newLanguage]);
    return { success: true };
  }, [customLanguages]);

  // Get language label by code
  const getLanguageLabel = useCallback((code: string): string => {
    const language = allLanguages.find(lang => lang.code === code);
    return language?.label || code;
  }, [allLanguages]);

  return {
    allLanguages,
    addCustomLanguage,
    getLanguageLabel,
  };
}
