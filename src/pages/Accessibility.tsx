import { Box, Container, Heading, Text } from '@chakra-ui/react'

export function Accessibility() {
  return (
    <Box p={10}>
      <Container maxW="container.xl">
        <Heading as="h1" mb={6}>Website Accessibility</Heading>
        <Box bg="var(--card-bg)" borderRadius="xl" p={6} color="var(--card-text)" boxShadow="xl">
          <Heading as="h2" size="lg" mt={8} mb={4}>1. General description of the service</Heading>

          <Text mb={4}>This declaration applies to the website with URL https://www.olympics.com/en/milano-cortina-2026 (the "Website").</Text>

          <Text mb={6}>The Website is operated by the International Olympic Committee with registered office at Maison Olympique (Olympic House), 1007 Lausanne, Switzerland (hereinafter, the "Provider").</Text>

          <Heading as="h3" size="md" mt={6} mb={4}>1.1. Summary Description</Heading>

          <Text mb={4}>The Website is the main digital hub for the Olympic Winter Games Milano Cortina 2026 (referred to herein as "Milano Cortina 2026"). It provides multilingual and regularly updated content which aims to inform and engage a global audience. The Website is designed to ensure accessibility, usability, and alignment with Milano Cortina 2026's inclusive values.</Text>

          <Text mb={4}>Through the Website, users can:</Text>

          <Box as="ul" pl={6} mb={6} css={{ listStyleType: 'disc' }}>
            <Box as="li" mb={2}>
              <Text>read news, explore event schedules, and track countdowns for Milano Cortina 2026;</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>discover the history and rules of Olympic and Paralympic winter sports;</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>interact with maps of competition venues and territories;</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>learn about key initiatives relating to Milano Cortina 2026; and</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>register for digital initiatives (e.g. fan engagement opportunities), which include subscribing to newsletters for exclusive content and updates.</Text>
            </Box>
          </Box>

          <Heading as="h3" size="md" mt={6} mb={4}>1.2. Target users</Heading>

          <Text mb={6}>A global audience including spectators, athletes, journalists, partners, volunteers, institutions, and local communities interested in following and engaging with Milano Cortina 2026.</Text>

          <Heading as="h3" size="md" mt={6} mb={4}>1.3. Service delivery channels</Heading>

          <Text mb={6}>The Website at https://www.olympics.com/en/milano-cortina-2026/</Text>

          <Heading as="h2" size="lg" mt={8} mb={4}>2. Applicable accessibility requirements and compliance methods</Heading>

          <Heading as="h3" size="md" mt={6} mb={4}>2.1 Legal Framework</Heading>

          <Text mb={4}>The Website has been designed, developed, and delivered in accordance with the applicable accessibility legislation, including the Italian Legislative Decree No. 82/2022 (the "Italian Accessibility Decree"), which regulates the accessibility of digital services in Italy, including websites, provided by private entities.</Text>

          <Text mb={4}>The Italian Accessibility Decree defines the technical and functional requirements necessary to ensure equal access for all users, including persons with disabilities.</Text>

          <Text mb={6}>All requirements have been interpreted and implemented in alignment with Level AA of the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines 2.2 ("WCAG 2.2"), which serves as the technical benchmark under European accessibility regulations, including the Italian Accessibility Decree, as further detailed below.</Text>

          <Heading as="h3" size="md" mt={6} mb={4}>2.2 Technical standards and applied norms</Heading>

          <Text mb={4}>The accessibility of the Website conforms to Level AA of the World Wide Web Consortium (W3C) WCAG 2.2 (https://www.w3.org/TR/WCAG22/).</Text>

          <Box as="ul" pl={6} mb={6} css={{ listStyleType: 'disc' }}>
            <Box as="li" mb={2}>
              <Text>All meaningful elements on the Website, including images, videos, and interactive components, are provided with appropriate alternative text, ARIA labels, or other accessible name mechanisms to support assistive technologies.</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Decorative images and non-informative elements are properly marked or hidden, so they are ignored by assistive technologies.</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>The Website ensures sufficient color contrast between foreground and background elements, meeting or exceeding WCAG 2.2 contrast ratio requirements for text and interactive components.</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>All video content includes synchronized closed captions, enabling access to spoken information for users who are deaf or hard of hearing.</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Automatically moving, blinking, or scrolling content that lasts more than five seconds can be paused, stopped, or hidden by the user, ensuring compliance with accessibility standards.</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>The entire Website is fully operable using only a keyboard, allowing users to navigate, access, and interact with all content and features without requiring a mouse or touch input.</Text>
            </Box>
          </Box>

          <Heading as="h2" size="lg" mt={8} mb={4}>3. Compatibility with assistive technologies</Heading>

          <Text mb={4}>The Website has been designed to ensure proper interoperability with major assistive technologies, in accordance with the Italian Accessibility Decree, and in line with WCAG 2.2 and EN 301 549 standards.</Text>

          <Text mb={6}>During development and testing phases, the Website was reviewed to verify compatibility and proper usability with the following assistive tools:</Text>

          <Heading as="h3" size="md" mt={6} mb={4}>3.1. Compatible Assistive Technologies:</Heading>

          <Box as="ul" pl={6} mb={6} css={{ listStyleType: 'disc' }}>
            <Box as="li" mb={2}>
              <Text>Screen readers: JAWS, NVDA, VoiceOver</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Screen magnifiers or zoom features</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Alternative input systems (on-screen keyboards, switch devices, etc.)</Text>
            </Box>
          </Box>

          <Heading as="h3" size="md" mt={6} mb={4}>3.2. Method of Verifying Interoperability:</Heading>

          <Box as="ul" pl={6} mb={6} css={{ listStyleType: 'disc' }}>
            <Box as="li" mb={2}>
              <Text>Manual Testing with Assistive Technologies</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Keyboard-Only Testing</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Cross-Browser and Cross-Platform Testing
                <Box as="ul" pl={6} css={{ listStyleType: 'circle' }}>
                  <Box as="li"><Text>Browsers (Chrome, Firefox, Safari, Edge)</Text></Box>
                  <Box as="li"><Text>Platforms (Windows, macOS, Android, iOS)</Text></Box>
                </Box>
              </Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Automated Testing Tools</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Conformance Evaluation based on WCAG Techniques</Text>
            </Box>
          </Box>

          <Heading as="h3" size="md" mt={6} mb={4}>3.3. Known Limitations (if any):</Heading>

          <Box as="ul" pl={6} mb={6} css={{ listStyleType: 'disc' }}>
            <Box as="li" mb={2}>
              <Text>PDF documents published on the Website</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Content retrieved from or hosted on third-party services, including embedded media and external platforms</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Third-party advertising banners and widgets integrated into the Website</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Certain video content</Text>
            </Box>
          </Box>

          <Heading as="h2" size="lg" mt={8} mb={4}>4. Accessibility evaluation</Heading>

          <Text mb={4}>The accessibility of the Website was evaluated July 2025 by internal team members, with the assistance of an external company, which performed an audit of the key pages and functionalities.</Text>

          <Text mb={4}>The assessment was carried out based on the accessibility requirements established in the Italian Accessibility Decree, with specific reference to the criteria defined in WCAG 2.2 – Level AA and EN 301 549.</Text>

          <Text mb={4}>The evaluation covered key aspects of the Website, including:</Text>

          <Box as="ul" pl={6} mb={6} css={{ listStyleType: 'disc' }}>
            <Box as="li" mb={2}>
              <Text>The user onboarding process and profile management</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>The discoverability of content through search functionality and consistent site navigation</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Core pages of the Website, such as the homepage, news, videos, schedule and results, medals, venues, and the torch relay section</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Typical user tasks, such as searching for and accessing information about the competition — including event dates, locations, start times, results, whether medals were awarded, and the names of the winners</Text>
            </Box>
          </Box>

          <Text mb={6} fontWeight="bold">Evaluation outcome: The Website was found to be compliant with the applicable accessibility requirements.</Text>

          <Heading as="h2" size="lg" mt={8} mb={4}>5. Updates and monitoring</Heading>

          <Text mb={4}>The Provider has implemented a continuous monitoring process to ensure that the Website complies with the accessibility requirements established in the Italian Accessibility Decree.</Text>

          <Text mb={4}>The monitoring process includes:</Text>

          <Box as="ul" pl={6} mb={6} css={{ listStyleType: 'disc' }}>
            <Box as="li" mb={2}>
              <Text>periodic review of the user interfaces and digital content;</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>automated testing tools on the pipeline;</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>the involvement of the technical team for resolving any identified non-conformities; and</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>making updates to this Accessibility Statement in case of significant changes to the Website.</Text>
            </Box>
          </Box>

          <Text mb={6} fontStyle="italic">Last revision: 31 July 2025</Text>

          <Heading as="h2" size="lg" mt={8} mb={4}>6. Handling of accessibility non-conformities</Heading>

          <Text mb={4}>In compliance with regulatory obligations and as part of its ongoing commitment to deliver an inclusive digital experience, the Provider has established a structured process for managing non-conformities related to the accessibility of the service.</Text>

          <Text mb={4}>If a non-conformity is identified – either through internal audits or periodic accessibility reviews, or as a result of user feedback – it is promptly logged in the technical management system and forwarded to the relevant development and quality assurance teams for analysis.</Text>

          <Text mb={4}>Each issue is assessed based on its severity and impact on the user experience, and a corrective action plan is defined with the goal of resolving the problem as quickly as possible, taking into account technical complexity and project priorities.</Text>

          <Text mb={4}>The Provider is committed to ensuring full traceability of the actions taken and, in cases where a quick resolution is not feasible, evaluates technically equivalent alternative solutions, in line with accessibility principles.</Text>

          <Heading as="h3" size="md" mt={6} mb={4}>Non-compliant elements</Heading>

          <Text mb={4}>The following elements are not covered by the Website's accessibility statement, as they fall outside of the Provider's direct control or are currently not fully compliant with WCAG 2.2 guidelines:</Text>

          <Box as="ul" pl={6} mb={6} css={{ listStyleType: 'disc' }}>
            <Box as="li" mb={2}>
              <Text>PDF documents</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Content retrieved from or hosted on third-party services, including embedded media and external platforms</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Third-party advertising banners and widgets integrated into the Website</Text>
            </Box>
            <Box as="li" mb={2}>
              <Text>Certain video content that may not yet meet all accessibility requirements</Text>
            </Box>
          </Box>

          <Text mb={6}>The Website will be updated regularly to improve accessibility, using the latest guidelines and technological innovations available.</Text>

          <Heading as="h2" size="lg" mt={8} mb={4}>7. Contact and feedback</Heading>

          <Text>For any accessibility-related issues concerning the Website, as well as for clarification requests or suggestions for improvement, users may contact the Provider via the following email address: <a href="https://support.olympics.com/hc/en-gb/" target="_blank" rel="noopener noreferrer">https://support.olympics.com/hc/en-gb/</a></Text>
        </Box>
      </Container>
    </Box>
  )
}
