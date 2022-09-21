import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ArticleIcon from "@mui/icons-material/Article";
import GitHubIcon from "@mui/icons-material/GitHub";
import SchoolIcon from "@mui/icons-material/School";

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={10}>
        <Typography variant="h4">Material UI on Remix</Typography>
        <Box mt={2}>
          <List>
            <ListItem disablePadding>
              <ListItemButton href="https://remix.run/docs" rel="noopener" target="_blank" >
                <ListItemIcon>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText primary="Remix docs" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton href="https://github.com/remix-run/remix" rel="noopener" target="_blank" >
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary="Contribute on GitHub" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton href="https://mui.com/" rel="noopener" target="_blank" >
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Learn Material UI" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Container>
  );
}
