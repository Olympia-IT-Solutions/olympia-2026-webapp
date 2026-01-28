import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export function PrivacyPolicy() {
  const { t } = useTranslation()

  return (
    <Box p={10}>
      <Container maxW="container.xl">
        <Heading as="h1" mb={6}>{t('footer.privacyPolicy')}</Heading>
        <Box bg="var(--card-bg)" borderRadius="xl" p={6} color="var(--card-text)" boxShadow="xl">
          <Box lineHeight={1.8} fontSize="0.95rem">
            
            <Heading as="h2" size="lg" mt={6} mb={4}>INTERNATIONAL OLYMPIC COMMITTEE - PRIVACY POLICY</Heading>
            
            <Text mb={4}>
              This Privacy Policy, as updated from time to time, explains how the International Olympic Committee ("IOC") processes personal data in the context of its digital activities. For example, websites, mobile applications, connected TV applications, digital marketing, online professional services and business resources, as well as fan engagement initiatives and online registration features that are managed by the IOC alone or in cooperation with other members of the Olympic Movement. We refer to these activities as the "Services" in this Privacy Policy.
            </Text>

            <Text mb={4}>
              It also details how the IOC processes the personal data that it receives from other organisations, or via cookies and similar technologies that are integrated into another organisation's digital properties for the benefit of the IOC.
            </Text>

            <Text mb={4}>
              Other organisations may launch and operate websites, newsletters, e-commerce platforms or other services that are (a) related to the Olympic Games, Youth Olympic Games or to the Olympic Movement's activities, or (b) feature Olympics-related content. Such sites and services are operated independently from the IOC and are not covered by this Privacy Policy. We therefore encourage you to read the terms of use and privacy policies that are applicable to those sites and services. If we collect or otherwise receive personal data through them, this will be indicated in the site's or service owner's privacy policies and/or terms of use.
            </Text>

            <Heading as="h3" size="md" mt={6} mb={4}>PRIVACY POLICY UPDATE</Heading>
            <Text mb={4}>
              This Privacy Policy was last updated on 13 January 2026. It has been updated to reflect the following material changes:
            </Text>
            <Box as="ul" mb={6} ml={4} listStyleType="disc" listStylePosition="inside">
              <Box as="li" mb={2}>We have introduced new and updated processing purposes, such as verifying user identity for access to the A365 Platform, assessing and enforcing contractual terms and intellectual property rights, carrying out background checks and related checks, and recording or transcribing certain online meetings where appropriate. Related changes have also been made throughout this Privacy Policy to reflect and support these updated purposes.</Box>
              <Box as="li" mb={2}>We have also added references to the Los Angeles 2028 Organising Committee for the Olympic and Paralympic Games to reflect their involvement and preparatory activities ahead of the Los Angeles 2028 Olympic and Paralympic Games.</Box>
            </Box>

            <Heading as="h2" size="lg" mt={6} mb={4}>Who are we?</Heading>

            <Text mb={4}>
              When we refer to ''we'', ''our'' or "us" in this Privacy Policy, we mean the IOC. The Privacy Policy also covers those instances where the IOC and the Olympic Foundation for Culture and Heritage (the "Foundation"), or the IOC and an Organising Committee for the Olympic and Paralympic Games (an "OCOG") process data jointly. Annexes 2 and 3, as updated from time to time, provide further details on such joint data processing.
            </Text>

            <Text mb={4}>
              The IOC is a private, not-for-profit, international organisation recognised to be of public interest by the Swiss authorities and constituted in the form of a Swiss law association, having its registered office in Maison Olympique (Olympic House) 1007 Lausanne, Switzerland. The mission of the IOC is to promote Olympism throughout the world, to lead the Olympic Movement and to ensure the regular celebration of the Olympic Games. To learn more about the IOC, its goals and activities, please consult the Olympic Charter and the IOC Principles.
            </Text>

            <Text mb={4}>
              The Foundation (with address Quai d'Ouchy 1, 1006 Lausanne, Switzerland) manages the Olympic Museum and the Olympic Studies Centre in Lausanne, Switzerland.
            </Text>

            <Text mb={4}>
              An OCOG is responsible for organising an edition of the Olympic Games and Paralympic Games. Each OCOG is based in the territory in which its respective Olympic and Paralympic Games shall be hosted.
            </Text>

            <Text mb={6}>
              When we refer to "you" or "your" we mean those individuals whose data we collect through the Services, or whose data we receive from other organisations that we work with.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>Our role in the processing of personal data</Heading>

            <Heading as="h3" size="md" mt={4} mb={2}>1. Data collected via the Services</Heading>
            <Text mb={4}>
              The IOC is an independent data controller of the personal data that is collected through the Services except:
            </Text>
            <Box as="ul" mb={6} ml={4} listStyleType="disc" listStylePosition="inside">
              <Box as="li" mb={2}>where the user-facing information (which includes information about cookies) provided in relation to the Services states otherwise;</Box>
              <Box as="li" mb={2}>where data is collected through a graphical user interface that is displayed on our Services but which is managed by another commercial organisation. Please see the section below entitled 'Third Party Environments' for more information;</Box>
              <Box as="li" mb={2}>where the Services relate to the Olympic Museum (in particular https://olympics.com/museum, https://museumshop.olympics.com), the Olympic Studies Centre (in particular https://olympics.com/ioc/olympic-studies-centre, https://library.olympics.com/) and other activities of the Foundation. In which case, your personal data will be processed by the IOC and the Foundation for the purposes detailed in Annex 2, acting as joint controllers; or</Box>
              <Box as="li" mb={2}>where the IOC is engaged in digital activities with other organisations within the Olympic Movement, such as OCOGs. In which case, Annex 3 of this Privacy Policy (or the privacy information presented at the point of data collection) details each organisation's controllership of the data involved.</Box>
            </Box>

            <Heading as="h3" size="md" mt={4} mb={2}>2. Data collected via third party sites and services</Heading>
            <Text mb={4}>
              Where the IOC receives information that has been collected by other organisations, the IOC is a data controller of the data it receives from them. This applies to personal data that is collected via websites and other digital services owned or operated by:
            </Text>
            <Box as="ul" mb={6} ml={4} listStyleType="disc" listStylePosition="inside">
              <Box as="li" mb={2}>each OCOG (including the Paris 2024 Organising Committee for the Olympic and Paralympic Games ("Paris 2024"), the Milano Cortina 2026 Organising Committee for the Olympic and Paralympic Games ("MiCo 2026") and the Los Angeles 2028 Organising Committee for the Olympic and Paralympic Games ("LA28")), and</Box>
              <Box as="li" mb={2}>other commercial organisations that are permitted to sell and promote Olympic-themed digital services or to use the Olympic Properties.</Box>
            </Box>

            <Text mb={6}>
              See paragraph 3 "Collection of data through third parties" in the section "What information do we collect?" (below) as well as Annex 3 for more details.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>What information do we collect?</Heading>

            <Heading as="h3" size="md" mt={4} mb={2}>1. Information that you provide to us</Heading>
            <Text mb={4}>
              You provide us with information, including personal data, when you use the Services. For example when you sign up for and sign in to a user account, complete certain transactions or subscribe to Services, promotional communications or media alerts. We also collect data when you communicate with us.
            </Text>

            <Heading as="h4" size="sm" mt={4} mb={2}>a) Information collected when you use the Services</Heading>
            <Text mb={4}>
              Certain Services require that you provide information about yourself. This is the case, for instance, in respect of the Services that we make available to other Olympic Movement stakeholders, are relevant to your registration or accreditation for the Olympic Games, Youth Olympic Games or other events organised by us, as well as the Services through which you may book travel and accommodation related to these events, or entail a game, contest, sweepstake or other fan engagement opportunity.
            </Text>

            <Text mb={6}>
              In these situations and where necessary we will inform you more specifically about the information we need to collect in order to provide you with the requested goods or services and of any other conditions applicable to the processing of this personal data. The information needed will vary depending on the nature of the Services. It may include information such as first name, last name, business organisation, job title, physical address, phone number, nationality, travel and accommodation details, passport or ID card number, credit card information, height and weight information, size of garments or shoes, allergies and food habits.
            </Text>

            <Heading as="h4" size="sm" mt={4} mb={2}>b) Information collected when you sign up for and sign in to a user account</Heading>
            <Text mb={4}>
              Individuals such as fans and athletes can register for a user account on the Olympics.com website and associated mobile application. If you use this type of account, we will collect the personal data that you provide to us as well as information that is automatically generated when you sign up for and sign in to the account (more particularly, data generated through cookies and similar technologies, subject to our Cookie Policy at https://olympics.com/en/cookie-policy). This personal data typically includes your email address, place of residence, age information, password, acceptance of terms and unique identifier, and may include further information such as your preferences and characteristics (i.e. your favourite sports), and a record of any consent that you provide (such as your consent to receive marketing communications).
            </Text>

            <Text mb={4}>
              Certain Services require the collection of additional information. When you create or use an athlete account on the A365 website (https://www.olympics.com/athlete365) or the A365 app (the "A365 Platform"), we may collect information that is necessary to verify your identity and to confirm your eligibility as an athlete. Such verification is carried out through designated identity-verification service providers. In this context, personal data processed for identity verification may include the information contained in the identity document you provide (such as your name, date of birth, document number, issuing country and the image of the document), as well as biometric data generated during liveness detection or similar checks (for example, images or video of your face captured in real time to confirm that the document belongs to you).
            </Text>

            <Heading as="h4" size="sm" mt={4} mb={2}>c) Information collected when you communicate with us</Heading>
            <Text mb={6}>
              If you communicate with us and/or request any information or service from us, we will use your account information and any other information you may provide to us (such as email address, phone number, and the content of your communication or request) in order to respond to you.
            </Text>

            <Heading as="h3" size="md" mt={4} mb={2}>2. Information that is collected through cookies and similar technologies</Heading>
            <Text mb={6}>
              We use automatic tracking mechanisms like cookies and similar technologies to collect certain data while you are browsing our Services, or when you visit the sites or services of other organisations that we work with. A cookie is a small file, stored on your browser or computer hard drive, which is used to collect data about your interactions with websites and other digital properties. For example, information about your device (browser type, operating system, language, unique device identifier), network connections (Internet Service Provider, IP address, time zone), browsing history including date and time and pages visited, as well as general location such as your city and country. You can disable cookies (except those cookies that are strictly necessary) or manage cookies using the cookies settings available on each of the websites or other digital properties through which the cookies are set. You can also manage cookies by configuring the functionalities of your internet browser. To know more about our use of cookies on the Services, and how to manage your consent to cookies, please consult our Cookie Policy at https://olympics.com/en/cookie-policy. Where our cookies are placed on third party sites or services, you should consult their cookie policies and consent management tools.
            </Text>

            <Heading as="h3" size="md" mt={4} mb={2}>3. Collection of data through third parties</Heading>
            <Text mb={4}>
              You can sign up for, or sign in to, a user account with the information of an account you hold with a third party such as Facebook, Google and Apple. If you choose this option, you authorise these organisations to provide us with some of the personal data they hold about you. The personal data shared with us will depend on the third party services that you use to register with us and on the scope of the information you allow those third parties to share, but typically it includes your first name and last name, user name, phone number, unique identifiers and access tokens, e-mail address, date of birth and preferences (e.g. pages you have favourited or saved).
            </Text>

            <Text mb={4}>
              In some scenarios we authorise third parties to launch and operate Olympic-themed digital services or to feature Olympic Properties within their websites or other digital services. For example, the Olympic Shop operated by Fanatics, Inc. and its affiliates under authorisation of the IOC and OCOGs (see, for instance, the EU version of the Olympic Shop here https://shop.olympics.com/en/). These third parties may share information that they collect about you with us, for example your first and last name or unique identifier, your email address, your stated marketing preferences and data about the webpages you visit and the Olympic-branded goods or services that you purchase. In such cases, the sharing of information with us will be specified in, and carried out in accordance with, the privacy and cookie policies issued by these third parties.
            </Text>

            <Text mb={6}>
              OCOGs, for example Paris 2024, MiCo 2026 and LA28, share the personal data of their users with the IOC. The IOC uses such data for purposes including Olympic Games optimisation, to better understand fans, to evaluate the performance of digital properties or activities connected to the Olympic Games or Paralympic Games, for commercial and operational reporting, to assess, establish and enforce the IOC's and/or the OCOG's rights, including their respective intellectual property rights, to promote the Olympic Movement, the IOC Marketing Partners and the Olympic Games, or to provide and personalise its Services. In such cases, this sharing of personal data with the IOC will be specified in, and carried out in accordance with, the privacy and cookie policies issued by each of the relevant OCOGs.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>How do we use the information we collect?</Heading>

            <Text mb={4}>
              We use the information we collect about you and your use of the Services and, where relevant, your use of third party sites and services, to facilitate your use of the Services, maintain and develop the Services, gather statistics, ensure security, carry out profiling and other purposes. We may combine information you provide with data from marketing and advertising cookies and information from third parties to build a profile and serve more relevant content and marketing communications.
            </Text>

            <Box as="ul" mb={6} ml={4} listStyleType="disc" listStylePosition="inside">
              <Box as="li" mb={2}>facilitate your use of the Services, which includes enabling you to register for a user account as well as account authentication and management;</Box>
              <Box as="li" mb={2}>maintain and develop the Services;</Box>
              <Box as="li" mb={2}>gather statistics to help diagnose problems, enhance your experience of the Services, improve the quality of the Services;</Box>
              <Box as="li" mb={2}>ensure the security of the Services and make sure that the Services are used in compliance with our Terms of Service and applicable laws;</Box>
              <Box as="li" mb={2}>allow you to participate in any game, contest, sweepstake or other fan engagement opportunity;</Box>
              <Box as="li" mb={2}>optimise the Olympic Games and Paralympic Games;</Box>
              <Box as="li" mb={2}>promote and raise awareness of the Olympic Movement, the Olympic Games and Paralympic Games;</Box>
              <Box as="li" mb={2}>provide you goods, services, information, or content that you have requested;</Box>
              <Box as="li" mb={2}>communicate with you, including by answering your questions and requests;</Box>
              <Box as="li" mb={2}>show and measure advertisements on the Services and third party services;</Box>
              <Box as="li" mb={2}>carry out internal commercial and operational reporting;</Box>
              <Box as="li" mb={2}>assess, investigate and enforce compliance with applicable terms and conditions;</Box>
              <Box as="li" mb={2}>establish, protect, and enforce our rights, including intellectual property and other legal rights;</Box>
              <Box as="li" mb={2}>verify the identity of users creating or using an athlete account on the A365 Platform;</Box>
              <Box as="li" mb={2}>conduct background checks and other appropriate verifications;</Box>
              <Box as="li" mb={2}>record and, where applicable, transcribe online meetings.</Box>
            </Box>

            <Heading as="h2" size="lg" mt={6} mb={4}>Who do we share your information with?</Heading>

            <Text mb={4}>
              We may share your personal data with the Foundation, OCOGs, our service providers, third parties for events and initiatives, our partners, and where required by law. Service providers helping us operate, develop, secure and promote the Services are bound by strict confidentiality obligations.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>How do we protect your personal data?</Heading>

            <Text mb={4}>
              We use technical and organisational measures to protect your personal data against the risks of damage, destruction, loss or unauthorised access, in accordance with applicable laws. We may process your personal data in territories other than your place of residence and adopt measures to ensure relevant protection. Your personal data will usually be processed in the European Union, the United Kingdom or in Switzerland, and we implement safeguard mechanisms recognised by Swiss and European regulators.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>Your rights and how to exercise them</Heading>

            <Text mb={4}>
              You can exercise your rights of access to, rectification, deletion and portability of your personal data, limitation and objection to its processing, as well as your right to withdraw your consent at any given moment. To exercise your data protection rights, you can contact us through the IOC's dedicated portal or contact our Data Protection Officer.
            </Text>

            <Text mb={4}>
              <strong>Data Protection Officer:</strong><br/>
              International Olympic Committee<br/>
              Maison Olympique (Olympic House)<br/>
              1007 Lausanne<br/>
              Switzerland
            </Text>

            <Text mb={6}>
              In cases where the EU General Data Protection Regulation (GDPR) applies, you have the right to lodge a complaint with a European Union supervisory authority. Where the UK GDPR applies, you can contact the UK's Information Commissioner's Office. Where Swiss data protection law applies, you can refer the matter to the Federal Data Protection and Information Commissioner in Bern, Switzerland.
            </Text>

            <Box mt={8} pt={6} borderTop="1px solid" borderColor="gray.300">
              <Text fontSize="sm" opacity={0.8}>
                This Privacy Policy was last updated on 13 January 2026.
              </Text>
              <Text fontSize="sm" opacity={0.8} mt={2}>
                International Olympic Committee, Maison Olympique (Olympic House), 1007 Lausanne, Switzerland
              </Text>
            </Box>

          </Box>
        </Box>
      </Container>
    </Box>
  )
}
