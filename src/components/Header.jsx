import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = () => (
  <Box bg="blue.500" color="white" px={4} py={2}>
    <Flex align="center">
      <Heading size="md">Movie Streaming</Heading>
      <Spacer />
      <Button as={Link} to="/" colorScheme="teal" variant="outline">
        Home
      </Button>
    </Flex>
  </Box>
);

export default Header;