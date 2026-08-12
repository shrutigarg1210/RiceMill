import {
    Paper,
    Box,
    Typography
} from "@mui/material";

export default function AuthCard({

    title,

    subtitle,

    children

}) {

    return (

        <Paper

            className="glass"

            elevation={0}

            sx={{

                width: 430,

                p: 5,

                borderRadius: 5

            }}

        >

            <Box

                display="flex"

                flexDirection="column"

                alignItems="center"

            >

                <img

                    src="/logo.png"

                    alt="MBRG"

                    style={{

                        width: 130,

                        marginBottom: 20

                    }}

                />

                <Typography

                    variant="h4"

                    fontWeight={700}

                >

                    {title}

                </Typography>

                <Typography

                    color="text.secondary"

                    mb={4}

                >

                    {subtitle}

                </Typography>

            </Box>

            {children}

        </Paper>

    );

}