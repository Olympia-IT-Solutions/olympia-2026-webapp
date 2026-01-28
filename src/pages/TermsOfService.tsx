import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export function TermsOfService() {
  const { t } = useTranslation()

  return (
    <Box p={10}>
      <Container maxW="container.xl">
        <Heading as="h1" mb={6}>{t('footer.termsOfService')}</Heading>
        <Box bg="var(--card-bg)" borderRadius="xl" p={6} color="var(--card-text)" boxShadow="xl">
          <Box lineHeight={1.8} fontSize="0.95rem">
            
            <Heading as="h2" size="lg" mt={6} mb={4}>TERMS OF SERVICE</Heading>
            
            <Text mb={4}>
              These Terms of Service including other documents referred to herein, as updated from time to time, apply to your use of the Services. In this context, the term "Services" refers to all digital activities, such as websites (including Olympics.com), mobile applications, connected TV applications, newsletters, registration systems, online professional services and other business resources managed by the International Olympic Committee (the "IOC"), alone or in cooperation with other members of the Olympic Movement, including the Olympic Foundation for Culture and Heritage (the "Foundation") and/or Organising Committee(s) for the Olympic and Paralympic Games.
            </Text>

            <Text mb={4}>
              Specific rules and additional terms ("Additional Terms") may apply due to the nature and purpose of the Services. This is, for instance, the case for certain online professional services and business resources ("B2B Services") or reporting mechanisms managed by the IOC. In such cases, these specific terms will be brought to your attention before you use the relevant Services and shall prevail over these Terms of Service in case of any inconsistency or contradiction.
            </Text>

            <Text mb={4}>
              Separate terms may apply to digital activities (including on or in connection with the Olympics.com website) managed primarily or exclusively by members of the Olympic Movement other than the IOC and/or the Foundation (e.g. digital activities on a section of the Olympics.com website that is dedicated to a specific edition of the Games). In such cases, these Terms of Service do not apply. The applicable separate terms will be made available to you on the relevant webpages and/or otherwise brought to your attention before you use the relevant Services.
            </Text>

            <Text mb={6}>
              For simplicity, the Terms of Service and any Additional Terms shall be collectively referred to below as the "Terms".
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>WHO ARE WE?</Heading>

            <Text mb={4}>
              When we refer to ''we'', ''our'' or "us" in these Terms of Service, we are referring to the IOC and, where applicable, to the Foundation and/or other members of the Olympic Movement.
            </Text>

            <Text mb={4}>
              When we refer to "you" or "your" we refer to you as user of the Services.
            </Text>

            <Text mb={4}>
              The IOC is a private, not-for-profit, international organisation recognized to be of public interest by the Swiss authorities and constituted in the form of a Swiss law association, having its registered office at Maison Olympique (Olympic House), 1007 Lausanne, Switzerland. The mission of the IOC is to promote Olympism throughout the world, to lead the Olympic Movement and to ensure the regular celebration of the Olympic Games. To know more about the IOC, our goals and our activities, please consult the Olympic Charter and information provided on our website https://olympics.com/ioc/principles.
            </Text>

            <Text mb={4}>
              The Foundation was created by the IOC to promote Olympism in the areas of culture, heritage and education and it manages the Olympic Museum and the Olympic Studies Centre in Lausanne, Switzerland.
            </Text>

            <Text mb={6}>
              An Organising Committee for the Olympic and Paralympic Games is responsible for organising an edition of the Olympic Games and Paralympic Games. Each such organising committee is based in the territory in which its respective Olympic and Paralympic Games shall be hosted.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>WHY SHOULD YOU READ THESE TERMS OF SERVICE?</Heading>

            <Text mb={4}>
              Our Terms aim to inform you of the conditions under which you may use the Services and access, use, view and share the Olympic Content (as defined below). By accessing and using the Services, you agree to be bound by these Terms. If you do not agree with these Terms, do not use the Services.
            </Text>

            <Text mb={4}>
              Please note that if you access Olympic Content (as defined below) via services operated by third parties, such as social media services, additional terms issued by such third parties may also apply.
            </Text>

            <Text mb={6}>
              We reserve the right to modify the Terms, at any time. When we make changes, we will revise the "last updated" date at the bottom of the Terms and any change will be effective immediately upon posting. When we make changes to the Terms, we will adequately inform you in advance where such changes impact your rights as a user of the Services or where required by law. However, your continued use of the Services following the posting of changes shall constitute your acceptance of such changes. We encourage you to review the applicable version of the Terms whenever you use the Services.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>1) WHAT CAN YOU FIND ON THE SERVICES?</Heading>

            <Heading as="h3" size="md" mt={4} mb={2}>1.1 Olympic Content</Heading>
            <Text mb={4}>
              In the Terms, "Olympic Content" refers to any audiovisual or other content, information or materials accessible through the Services such as texts, illustrations, artworks, graphics, data, moving and still images, sounds, music, or software. The Olympic Content is protected by copyright, trademarks, or other proprietary rights and laws. All rights, including all intellectual property rights, or other proprietary rights in the Services and the Olympic Content, except for Your Content (as defined below), are owned by the IOC, the Foundation and/or other members of the Olympic Movement, or licensed to us by the respective rights owners. All rights not expressly granted to you under the present Terms are reserved.
            </Text>

            <Text mb={6}>
              Olympic Content may vary depending on the geographical location, or device from which you access the Services, or whether you have created a user account.
            </Text>

            <Heading as="h3" size="md" mt={4} mb={2}>1.2 Your Content</Heading>
            <Text mb={4}>
              Through the Services, you may be offered the possibility to provide feedback and interact with other users, by making comments or by making available other types of content ("Your Content").
            </Text>

            <Text mb={6}>
              You retain all ownership rights and are solely responsible for Your Content. By making available Your Content to us, however, you grant us a non-exclusive, royalty-free, worldwide, transferable, license (with a right to sublicense) to use, reproduce, display, distribute, make available and prepare derivative works of Your Content, in whole or in part, in any media formats and through any media now known or to be known, in connection with the IOC, the Foundation and/or other members of the Olympic Movement and the promotion of the Olympic Movement. You also grant each user of the Services a non-exclusive, royalty-free, worldwide license to access Your Content through the Services and to use it in accordance with the present Terms. All licenses granted to us and the users of the Services in relation to Your Content shall continue indefinitely, unless you request that we remove Your Content from the Services.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>2) WHO CAN USE THE SERVICES?</Heading>

            <Text mb={4}>
              The Services are intended for users who are of legal age for data protection purposes, and for purposes of receiving the Services (according to the laws of the territory in which they reside). You can learn more about our age requirements for data protection purposes here: https://olympics.com/en/age-consent.
            </Text>

            <Text mb={4}>
              Most of our Services are available to the general public but access and use of certain B2B Services may be limited to the IOC's, the Foundation's and/or other members of the Olympic Movement's collaborators, consultants, stakeholders and other authorised third parties.
            </Text>

            <Text mb={4}>
              Your use of the Services is at your risk and you are responsible for ensuring that your use of the Services complies with the applicable laws of your territory of residence or use.
            </Text>

            <Text mb={6}>
              We reserve the right to terminate your access to the Services and your user account at our discretion, in particular if we believe that you do not comply with the Terms.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>3) HOW CAN YOU USE THE SERVICES?</Heading>

            <Text mb={4}>
              We grant you a limited, revocable, non-exclusive, non-transferable and non-sub licensable, license to access and use the Services and Olympic Content for informative purposes only, subject to any further conditions defined in any Additional Terms and provided that you comply with the Terms and in particular the following conditions:
            </Text>

            <Box as="ul" mb={6} ml={4} listStyleType="disc" listStylePosition="inside">
              <Box as="li" mb={2}>The Services cannot be used for advertising purposes, or in any manner implying an association between a third party, or a third party's product and services, and the IOC, the Foundation or the Olympic Movement, without our prior written authorization.</Box>
              <Box as="li" mb={2}>Through available functionalities, you are authorized to share Olympic Content for personal and non-commercial purposes only and in a manner otherwise consistent with these Terms.</Box>
              <Box as="li" mb={2}>You may not upload or post on the Services any comment or other content that is unlawful, defamatory, violent, obscene, racist, discriminatory against any third party or otherwise contrary to the Olympic values.</Box>
              <Box as="li" mb={2}>You may not use, or attempt to use, the Services or the Olympic Content to commit any unlawful act or to defame, harass, insult or impersonate other users or third parties.</Box>
              <Box as="li" mb={2}>Except as expressly provided in these Terms, you are not authorized to copy, archive, download, reproduce, modify, broadcast, communicate to the public and/or make available, the Services or any Olympic Content, without our prior written authorization.</Box>
              <Box as="li" mb={2}>You may not transfer, assign or sublicense any rights and licenses granted to you under the Terms, but our rights and obligations may be assigned by us without restriction.</Box>
              <Box as="li" mb={2}>You may not alter or modify or circumvent any component of the Services, or attempt to do so, or encourage or assist any other person to do so.</Box>
              <Box as="li" mb={2}>You may not introduce or attempt to introduce any form of malicious software into the Services. This includes, but is not limited to, virus, "worms", Trojan horse, spyware, ransomware, logic bombs or any other code, file, or program designed to disrupt, damage, impair, or gain unauthorized access to the Services, the underlying infrastructure, or any associated systems or data.</Box>
              <Box as="li" mb={2}>You may not systematically collect, compile, harvest, or gather Olympic Content or any other data from the Services, whether directly or indirectly, for the purpose of creating or supplementing a collection, database, directory, or similar resource. This includes, but is not limited to, the use of any software, tools, scripts, robots, spiders, crawlers, browser plugins, add-ons, or other automated means or processes to access, scrape, extract, monitor or copy any part of the Services. Furthermore, you may not use Olympic Content or any other data from the Services to develop, train, or improve any software, algorithm, model, or artificial intelligence system, including but not limited to machine learning models or generative AI tools.</Box>
              <Box as="li" mb={2}>You may not collect or use any personal information about other users or third parties from the Services, nor use the Services for any commercial solicitation purposes.</Box>
              <Box as="li" mb={2}>You may not facilitate or encourage any violation of the Terms by third parties.</Box>
            </Box>

            <Heading as="h2" size="lg" mt={6} mb={4}>4) HOW CAN YOU CREATE A USER ACCOUNT?</Heading>

            <Text mb={4}>
              Creating a user account is not always required to access and use the Services and Olympic Content, but some features and functionalities of the Services and some Olympic Content may be available only to users who have registered with us and created a user account. For certain Services the creation of a user account may be subject to additional conditions or be reserved to the IOC's, the Foundation's, and/or other members of the Olympic Movement's collaborators, consultants, stakeholders and other authorised third parties.
            </Text>

            <Text mb={4}>
              You can create a user account by signing up with us through the Services. Registration requires that you provide us with certain information about yourself. Please see our Privacy Policy (https://olympics.com/en/privacy-policy) for more information.
            </Text>

            <Text mb={4}>
              All information you provide during the registration process must be accurate and complete. You are responsible for the accuracy and completeness of the information provided, and for keeping your account username and password confidential, and for all activity that occurs under your account.
            </Text>

            <Text mb={6}>
              When you register, we will ask you to confirm that you agree with the Terms, and that you have read and understood our Privacy Policy.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>5) WHAT INFORMATION DO WE COLLECT ABOUT YOU AND HOW DO WE USE IT?</Heading>

            <Text mb={6}>
              When you access the Services and when you create a user account, we will collect certain information about you. Our Privacy Policy and our Cookie Policy (https://olympics.com/en/cookie-policy) provide more information about the information collected and how it is used.
            </Text>

            <Heading as="h2" size="lg" mt={6} mb={4}>6) WHAT ELSE SHOULD YOU KNOW?</Heading>

            <Heading as="h3" size="md" mt={4} mb={2}>6.1 You agree to the following:</Heading>
            <Box as="ul" mb={6} ml={4} listStyleType="disc" listStylePosition="inside">
              <Box as="li" mb={2}>We (including our officers, directors, employees, agents, affiliates and subcontractors) disclaim all liability for losses and/or damages caused by any unauthorized use of your user account and it is your responsibility to immediately notify the IOC of any breach of security or unauthorized use of your user account;</Box>
              <Box as="li" mb={2}>Despite our efforts to provide accurate information and to prevent disruption caused by technical problems, the Services may contain technical mistakes, inaccuracies or typographical errors or be temporarily unavailable to you and we cannot be held liable for such occurrences;</Box>
              <Box as="li" mb={2}>Your use of the Services requires one or more compatible devices, internet access and certain hardware and software and may require obtaining updates or upgrades from time to time. You agree that your ability to use the Services may be affected by the performance of such materials and that such system requirements are under your responsibility as well as all costs incurred by their use including your internet or data service providers charges;</Box>
              <Box as="li" mb={2}>The Services, including all Olympic Content, is provided to you "as is" and, to the fullest extent permitted by applicable law, we (including our officers, directors, employees, agents, affiliates and subcontractors) disclaim all express or implied warranties in connection with the Services, Olympic Content (including any link to any third party websites, and any offer of service or product made by third parties) and your use thereof. These disclaimed warranties include warranties of availability, and fitness for a particular purpose;</Box>
              <Box as="li" mb={2}>Each member of the Olympic Movement (including the IOC, and including their respective officers, directors, employees, agents, affiliates and subcontractors) disclaims all liability for Services and/or parts of the Olympic Content provided by other members of the Olympic Movement. Except where expressly mentioned otherwise, the provision of Services (including parts of the Olympics.com website and/or of the Olympic Content) by other members of the Olympic Movement shall not be interpreted as a recommendation or endorsement by the IOC;</Box>
              <Box as="li" mb={2}>We reserve the right to modify, improve, update, suspend or terminate any functionality of the Services or any Olympic Content, at our discretion and without notice;</Box>
              <Box as="li" mb={2}>Except where expressly mentioned otherwise, links provided on the Service to any third-party websites or services, or to offers for third party products or services, shall not be interpreted as a recommendation or endorsement by us; and</Box>
              <Box as="li" mb={2}>Although we make our best efforts to reply to any questions asked or request made to us through the Services in a timely manner, we do not guarantee any specific turnaround time, and reserve the right to refrain from answering any communication which does not comply with the Terms.</Box>
            </Box>

            <Heading as="h3" size="md" mt={4} mb={2}>6.2 Limitation of Liability</Heading>
            <Text mb={4}>
              To the fullest extent admissible under law, we (including our officers, directors, employees, agents, affiliates and subcontractors) shall not be liable to you or third parties for damages of any kind arising in connection with:
            </Text>
            <Box as="ul" mb={6} ml={4} listStyleType="disc" listStylePosition="inside">
              <Box as="li" mb={2}>Your access to or use of Services and any Olympic Content, or of the websites linked to the Services;</Box>
              <Box as="li" mb={2}>Any unauthorized access or use of our servers and/or any personal information or other information stored therein;</Box>
              <Box as="li" mb={2}>Any errors or inaccuracies in the Olympic Content;</Box>
              <Box as="li" mb={2}>Any delays, interruptions, failure, poor quality or limitations of any kind in transmissions from the Services or in the delivery or in the performance of services offered via the Services; and</Box>
              <Box as="li" mb={2}>Any bugs, viruses, or the likes which may be transmitted to or through the Service by any third party.</Box>
            </Box>

            <Heading as="h3" size="md" mt={4} mb={2}>6.3 Indemnification</Heading>
            <Text mb={6}>
              You agree to defend, indemnify and hold the IOC, the Foundation and the other relevant members of the Olympic Movement (including their respective officers, directors, employees, agents, affiliates and subcontractors) harmless from and against any claims, liability, losses, damages and costs (including legal fees) arising in connection with your violation of the present Terms. This defence and indemnification will survive the present Terms and your use of the Services. You further agree that the IOC, the Foundation and/or the other relevant members of the Olympic Movement may invoke jointly or separately any rights or protection afforded to them pursuant to these Terms towards you.
            </Text>

            <Heading as="h3" size="md" mt={4} mb={2}>6.4 General Provisions</Heading>
            <Text mb={6}>
              No action from our part, other than written waiver or amendment, may be construed as a waiver or amendment of these Terms. If any provision of these Terms is found invalid or unenforceable, the remainder of these Terms shall remain valid and enforceable to the fullest possible extent under applicable law.
            </Text>

            <Heading as="h3" size="md" mt={4} mb={2}>6.5 Applicable Law and Jurisdiction</Heading>
            <Text mb={6}>
              The Terms shall be governed and interpreted by the laws of Switzerland, without reference to conflict of laws. Any dispute arising from or in connection with the execution or interpretation of these Terms or breach thereof which cannot be settled amicably shall be submitted to the exclusive jurisdiction of the Courts of Lausanne, Switzerland.
            </Text>

            <Box mt={8} pt={6} borderTop="1px solid" borderColor="gray.300">
              <Text fontSize="sm" opacity={0.8}>
                These Terms of Service were last updated on 24 September 2025.
              </Text>
              <Text fontSize="sm" opacity={0.8} mt={2}>
                International Olympic Committee, Maison Olympique (Olympic House), 1007 Lausanne, Switzerland.
              </Text>
              <Text fontSize="sm" opacity={0.8} mt={2}>
                Olympic Foundation for Culture and Heritage, Quai d'Ouchy 1, 1006 Lausanne, Switzerland.
              </Text>
            </Box>

          </Box>
        </Box>
      </Container>
    </Box>
  )
}
