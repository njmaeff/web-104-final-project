import {ThemeEnvironment} from "../styles/theme";

export const WithTheme = (Story) =>
    <ThemeEnvironment><Story/></ThemeEnvironment>
