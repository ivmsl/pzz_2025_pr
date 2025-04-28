import { Container, Typography, Box } from '@mui/material';

export default function Policy() {
  return (
    <Container maxWidth="md" sx={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Typography variant="h4" gutterBottom>
        Polityka Prywatności
      </Typography>

      <Typography variant="body1" paragraph>
        Niniejsza Polityka Prywatności określa zasady dotyczące przetwarzania danych osobowych
        oraz stosowania plików cookies w ramach korzystania ze danej strony internetowej.
      </Typography>

      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Brak przetwarzania danych osobowych
        </Typography>
        <Typography variant="body1" paragraph>
          Szanujemy prywatność użytkowników naszej strony internetowej. Informujemy, że nie przetwarzamy żadnych danych
          osobowych użytkowników w rozumieniu Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO)
          oraz Digital Personal Data Protection Act (DPDPA).
        </Typography>
        <Typography variant="body1" paragraph>
          Nie prowadzimy rejestracji użytkowników, nie udostępniamy formularzy kontaktowych, nie zbieramy adresów e-mail
          ani innych danych identyfikujących użytkowników strony.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
          2. Brak stosowania plików cookies
        </Typography>
        <Typography variant="body1" paragraph>
          Nasza strona nie wykorzystuje plików cookies (ciasteczek), zarówno własnych, jak i podmiotów trzecich.
          Nie śledzimy aktywności użytkowników na stronie ani nie analizujemy ruchu za pomocą narzędzi analitycznych.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
          3. Udostępnianie treści z zewnętrznego źródła (plan.ii.us.edu.pl)
        </Typography>
        <Typography variant="body1" paragraph>
          Strona automatycznie prezentuje wybrane informacje (harmonogram zajęć) pochodzące z serwisu plan.ii.us.edu.pl.
          Zawartość informacji materiałów odbywa się w formie „as is” (tak jak są), w sposób automatyczny, bez ręcznej
          ingerencji redakcyjnej, z ewentualną zmianą widoku i osłony graficznej informacji.
        </Typography>
        <Typography variant="body1" paragraph>
          Nie ponosimy odpowiedzialności za zawartość tych treści, ich aktualność, kompletność ani ewentualne dane, które mogą się w nich pojawić.
        </Typography>
        <Typography variant="body1" paragraph>
          Nie rościmy sobie żadnych praw własności intelektualnej do materiałów pochodzących z plan.ii.us.edu.pl.
          Treści te prezentowane są wyłącznie w ramach niekomercyjnego dozwolonego użytku, jako część projektu o charakterze edukacyjnym/studenckim.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
          4. Zmiany w Polityce Prywatności
        </Typography>
        <Typography variant="body1" paragraph>
          Zastrzegamy sobie prawo do wprowadzenia zmian w niniejszej Polityce Prywatności w przypadku zmiany przepisów prawa
          lub charakteru działania strony. Wszelkie zmiany będą publikowane na tej podstronie.
        </Typography>
      </Box>

      <Typography variant="body1" paragraph sx={{ marginTop: 3 }}>
        W razie pytań proszę się zwracać na adres mailowy: <strong>0013013140@us.edu.pl</strong>
      </Typography>
    </Container>
  );
}
