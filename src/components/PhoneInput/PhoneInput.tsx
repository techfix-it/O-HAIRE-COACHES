'use client';

import React, { useState, useRef, useEffect } from 'react';
import './PhoneInput.css';

export type Country = {
  code: string;
  name: string;
  dial: string;
  flag: string;
  mask: string;
};

export const COUNTRIES: Country[] = [
  { code: 'IE', name: 'Ireland',        dial: '+353', flag: 'ie', mask: '## ### ####' },
  { code: 'GB', name: 'United Kingdom', dial: '+44',  flag: 'gb', mask: '#### ### ####' },
  { code: 'US', name: 'United States',  dial: '+1',   flag: 'us', mask: '(###) ###-####' },
  { code: 'BR', name: 'Brazil',         dial: '+55',  flag: 'br', mask: '(##) #####-####' },
  { code: 'PT', name: 'Portugal',       dial: '+351', flag: 'pt', mask: '### ### ###' },
  { code: 'ES', name: 'Spain',          dial: '+34',  flag: 'es', mask: '### ### ###' },
];

function applyMask(digits: string, mask: string): string {
  let di = 0;
  let result = '';
  for (let i = 0; i < mask.length && di < digits.length; i++) {
    if (mask[i] === '#') {
      result += digits[di++];
    } else {
      result += mask[i];
    }
  }
  return result;
}

type Props = {
  value: string;
  onChange: (full: string) => void;
  required?: boolean;
};

export function PhoneInput({ value, onChange, required }: Props) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [numeral, setNumeral] = useState('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const digits = numeral.replace(/\D/g, '');
    const formatted = digits ? applyMask(digits, country.mask) : '';
    onChange(digits ? `${country.dial} ${formatted}` : '');
  }, [country, numeral]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (value === '') setNumeral('');
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNumeral = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const maxDigits = country.mask.split('').filter(c => c === '#').length;
    setNumeral(raw.slice(0, maxDigits));
  };

  const filtered = COUNTRIES.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  const displayValue = numeral ? applyMask(numeral, country.mask) : '';

  return (
    <div className="phone-input-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="phone-country-btn"
        onClick={() => { setOpen(o => !o); setSearch(''); }}
      >
        <img src={`https://flagcdn.com/w20/${country.flag}.png`} width={20} alt={country.name} className="phone-flag" />
        <span className="phone-dial">{country.dial}</span>
        <span className="phone-caret">▾</span>
      </button>

      <input
        type="tel"
        className="phone-number-input"
        placeholder={country.mask.replace(/#/g, '0')}
        value={displayValue}
        onChange={handleNumeral}
        required={required}
        inputMode="numeric"
      />

      {open && (
        <div className="phone-dropdown">
          <input
            type="text"
            className="phone-search-input"
            placeholder="Search country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="phone-list">
            {filtered.map(c => (
              <li key={c.code}>
                <button
                  type="button"
                  className={`phone-option ${c.code === country.code ? 'active' : ''}`}
                  onClick={() => { setCountry(c); setNumeral(''); setOpen(false); setSearch(''); }}
                >
                  <img src={`https://flagcdn.com/w20/${c.flag}.png`} width={20} alt={c.name} className="phone-flag" />
                  <span className="phone-option-name">{c.name}</span>
                  <span className="phone-option-dial">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
