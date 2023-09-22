import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';
import { Container } from '@react-email/container';

export default function FormMail({ subject, body, formLink }) {
  return (
    <Html>
      <title>{subject}</title>
      <body>
        <Section style={main}>
          <Container style={container}>
            <Text style={heading}>{subject}</Text>
            <Text style={paragraph}>Dear User,</Text>
            <Text style={paragraph}>{body}</Text>
            <Text style={paragraph}>
              To access the form, please click on the following link:
            </Text>
            <a href={formLink}>{formLink}</a>
          </Container>
        </Section>
      </body>
    </Html>
  );
}

// Styles for the email template
const main = {
  backgroundColor: '#ffffff'
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px'
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848'
};

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848'
};
