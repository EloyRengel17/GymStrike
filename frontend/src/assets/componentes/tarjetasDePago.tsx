import React from 'react';

const STRIPE_LINKS = {
  matutino: "https://buy.stripe.com/test_bJeaEQ9sX4Nebxv4FJejK00",
  full: "https://buy.stripe.com/test_5kQ6oAfRl5RidFD7RVejK01"
};

export default function PricingCards() {
  return (
    <div style={styles.container}>
      
      {/* Encabezado */}
      <div style={styles.header}>
        <h1 style={styles.title}>Selecciona tu plan</h1>
        <p style={styles.subtitle}>
          Elige la opción que mejor se adapte a tu horario y necesidades.
        </p>
      </div>

      {/* Contenedor de las Tarjetas (Una al lado de la otra) */}
      <div style={styles.grid}>
        
        {/* Tarjeta: Plan Matutino */}
        <div style={styles.card}>
          <div style={styles.cardContent}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Matutino</h2>
              <span style={styles.badge}>Popular</span>
            </div>
            
            <div style={styles.priceContainer}>
              <span style={styles.price}>20,00 US$</span>
              <span style={styles.period}> / mes</span>
            </div>
            
            <p style={styles.description}>
              Podrás entrar en un horario correspondido entre las 11am a las 3pm.
            </p>
          </div>
          
          <a
            href={STRIPE_LINKS.matutino}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#000000'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1f36'}
          >
            Elegir Plan Matutino
          </a>
        </div>

        {/* Tarjeta: Plan Full */}
        <div style={styles.card}>
          <div style={styles.cardContent}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Full</h2>
            </div>
            
            <div style={styles.priceContainer}>
              <span style={styles.price}>40,00 US$</span>
              <span style={styles.period}> / mes</span>
            </div>
            
            <p style={styles.description}>
              Acceso total sin restricciones de horario. Ideal para máxima flexibilidad.
            </p>
          </div>
          
          <a
            href={STRIPE_LINKS.full}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#000000'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1f36'}
          >
            Elegir Plan Full
          </a>
        </div>

      </div>

      {/* Pie de página */}
      <div style={styles.footer}>
        <span>Powered by </span>
        <span style={styles.stripeText}>stripe</span>
      </div>
    </div>
  );
}

// Objeto de estilos con CSS puro para asegurar que renderice bien de inmediato
const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '60px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a1f36',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#697386',
    margin: 0,
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '30px',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '900px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    minWidth: '300px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'between',
    border: '1px solid #e3e8ee',
    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
    flex: '1',
  },
  cardContent: {
    flexGrow: 1,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1f36',
    margin: 0,
  },
  badge: {
    backgroundColor: '#e8f2ff',
    color: '#0066cc',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '100px',
  },
  priceContainer: {
    marginBottom: '20px',
  },
  price: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#1a1f36',
  },
  period: {
    fontSize: '1.1rem',
    color: '#697386',
    fontWeight: '500',
  },
  description: {
    fontSize: '1rem',
    color: '#697386',
    lineHeight: '1.6',
    marginBottom: '40px',
    marginHeight: '80px',
  },
  button: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#1a1f36',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '1.1rem',
    padding: '16px 0',
    borderRadius: '14px',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s ease',
    boxSizing: 'border-box',
  },
  footer: {
    marginTop: '60px',
    fontSize: '0.85rem',
    color: '#a3acb9',
  },
  stripeText: {
    fontWeight: '800',
    color: '#697386',
  }
};