import { Container, Typography, Box } from '@mui/material';

export default function About() {
  return (
    <Container maxWidth="md" sx={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Typography variant="h4" gutterBottom>
        O projekcie
      </Typography>

      <Typography variant="body1" paragraph>
        Projekt “Otwarty Plan.II” ma na celu uwolnić rzeczywisty harmonogram zajęć na wielu kierunkach Uniwersytetu Śląskiego
        spod zapory VPN, która została postawiona dla zabezpieczenia wewnętrznych serwerów z planem.
      </Typography>

      <Typography variant="body1" paragraph>
        Biorąc pod uwagę troskę o bezpieczeństwo sieciowe, projekt został wykonany z myślą o maksymalnym zabezpieczeniu zdalnego serwera.
        Komunikacja z plan.ii odbywa się na poziomie ściśle określonych GET-requestów. Informacja, która jest przedstawiona na stronach
        “Otwarty Plan.II”, pochodzi z przerabiania responsów strony plan.ii w postaci text/html, bez możliwości ustawienia ciała zapytania
        przez użytkownika końcowego.
      </Typography>

      <Typography variant="body1" paragraph>
        Co więcej, serwer, który obsługuje komunikację pomiędzy serwerem uczelnianym a tą stroną, jest zabezpieczony za reverse-proxy.
      </Typography>

      <Typography variant="body1" paragraph>
        Projekt został zrealizowany na potrzeby zajęć z Pracowni programowania zespołowego (PZZ) w trakcie letniego semestru 2024/2025
        ekipą studentów kierunku Informatyka Stosowana:
      </Typography>

      <Box sx={{ marginTop: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>Scrum Master</Typography>
        <Typography variant="body1">Ivan Maslov</Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>Backend</Typography>
        <Typography variant="body1">Developer Lead — Daniel Klimeczek</Typography>
        <Typography variant="body1">Developer — Anastasiya Dorosh</Typography>
        <Typography variant="body1">Developer — Danylo Rudenko</Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>Frontend</Typography>
        <Typography variant="body1">Developer Lead — Piotr Lewiński</Typography>
        <Typography variant="body1">Developer — Oleksii Melnyk</Typography>
        <Typography variant="body1">Developer — Mykhailo Kravchuk</Typography>
        <Typography variant="body1">Developer — Michael Koloch</Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>Testerzy</Typography>
        <Typography variant="body1">Tester — Maksym Melnyk</Typography>
        <Typography variant="body1">Tester — Yahor Kalbasich</Typography>
      </Box>

      <Typography variant="body1" paragraph>
        Repo: <a href="https://github.com/ivmsl/pzz_2025_pr" target="_blank" rel="noopener noreferrer">
          https://github.com/ivmsl/pzz_2025_pr
        </a>
      </Typography>

      <Typography variant="body1" paragraph>
        W razie pytań proszę się zwracać na adres: <strong>0013013140@us.edu.pl</strong>
      </Typography>
    </Container>
  );
}
