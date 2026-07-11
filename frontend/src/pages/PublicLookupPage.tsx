import axios from 'axios';
import { useState, type FormEvent } from 'react';
import apiClient from '../api/axiosClient';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import VisaResultCard from '../components/VisaResultCard';
import type { VisaPublicResponse } from '../types/visa';
import './PublicLookupPage.css';

const TRUST_POINTS = [
  {
    title: 'Official Government Service',
    body: 'Records are checked directly against the national e-visa register.',
  },
  {
    title: 'Secure Lookup',
    body: 'Searches are encrypted in transit and rate-limited to prevent abuse.',
  },
  {
    title: 'Real-Time Status',
    body: 'Status reflects the current date against the visa’s validity period.',
  },
];

const NEWS_ITEMS = [
  {
    image: '/pic-1.jpg',
    title: "Conferenza dei Consoli d'Italia nel mondo",
    date: '06/08/2026',
  },
  {
    image: '/pic-2.jpg',
    title: 'COOPERA, terza Conferenza nazionale della cooperazione allo sviluppo',
    date: '06/03/2026',
  },
  {
    image: '/pic-3.jpg',
    title: 'Trentennale InCE e Forum IMEC',
    date: '06/03/2026',
  },
];

export default function PublicLookupPage() {
  const [passportNumber, setPassportNumber] = useState('');
  const [evisaNumber, setEvisaNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VisaPublicResponse | null>(null);
  const [resultKey, setResultKey] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPassport = passportNumber.trim();
    const trimmedEvisa = evisaNumber.trim();

    if (!trimmedPassport || !trimmedEvisa) {
      setValidationError('Please enter both your passport number and e-visa number.');
      return;
    }

    setValidationError(null);
    setError(null);
    setLoading(true);

    try {
      const { data } = await apiClient.post<VisaPublicResponse>('/visas/lookup', {
        passportNumber: trimmedPassport,
        evisaNumber: trimmedEvisa,
        country: import.meta.env.VITE_COUNTRY ?? 'IT',
      });
      setResult(data);
      setResultKey((key) => key + 1);
    } catch (err) {
      setResult(null);

      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('VISA not verified. Please check your passport number and E-Visa number.');
      } else if (axios.isAxiosError(err) && err.response?.status === 429) {
        setError('Too many attempts. Please wait a minute before trying again.');
      } else {
        setError('Something went wrong while checking this VISA. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="site-shell__main">
        <section className="hero-band">
          <div className="hero-band__photo" aria-hidden="true" />
          <div className="hero-band__inner">
            <div className="hero-band__copy">
              <p className="hero-band__eyebrow">Official Travel Document Portal</p>
              <h1>Welcome to Italian Visa Verification System</h1>
              <p className="hero-band__lede">
                Enter the passport number and e-visa number exactly as they appear on the travel document to
                confirm its current status.
              </p>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="trust-strip__inner">
            {TRUST_POINTS.map((point) => (
              <div className="trust-strip__item" key={point.title}>
                <span className="trust-strip__bullet" aria-hidden="true" />
                <div>
                  <p className="trust-strip__title">{point.title}</p>
                  <p className="trust-strip__body">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lookup-page">
          <form className="lookup-form" onSubmit={handleSubmit} noValidate>
            <div className="lookup-form__field">
              <label htmlFor="passportNumber">Passport Number</label>
              <input
                id="passportNumber"
                name="passportNumber"
                type="text"
                autoComplete="off"
                value={passportNumber}
                onChange={(event) => setPassportNumber(event.target.value)}
                required
              />
            </div>

            <div className="lookup-form__field">
              <label htmlFor="evisaNumber">E-Visa Number</label>
              <input
                id="evisaNumber"
                name="evisaNumber"
                type="text"
                autoComplete="off"
                value={evisaNumber}
                onChange={(event) => setEvisaNumber(event.target.value)}
                required
              />
            </div>

            {validationError && (
              <p className="lookup-form__message lookup-form__message--error" role="alert">
                {validationError}
              </p>
            )}

            <button type="submit" className="lookup-form__submit" disabled={loading}>
              {loading ? 'Checking…' : 'Verify VISA'}
            </button>
          </form>

          {error && (
            <div className="lookup-result-message" role="alert">
              <p>{error}</p>
            </div>
          )}

          {result && <VisaResultCard key={resultKey} visa={result} />}
        </section>

        <section className="news-section">
          <div className="news-section__inner">
            {NEWS_ITEMS.map((item) => (
              <article className="news-card" key={item.title}>
                <div className="news-card__media">
                  <img src={item.image} alt="" />
                </div>
                <h3 className="news-card__title">{item.title}</h3>
                <p className="news-card__date">{item.date}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
