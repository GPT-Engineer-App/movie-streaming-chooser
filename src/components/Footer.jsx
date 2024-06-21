import { Box, Text } from "@chakra-ui/react";

const Footer = () => (
  <Box bg="blue.500" color="white" px={4} py={2}>
    <Text textAlign="center">&copy; {new Date().getFullYear()} Movie Streaming. All rights reserved.</Text>
  </Box>
);

export default Footer;