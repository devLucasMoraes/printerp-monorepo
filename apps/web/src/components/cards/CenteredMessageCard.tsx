import type { TypographyProps } from '@mui/material'
import { Box, Typography } from '@mui/material'

import BlankCard from './BlankCard'

interface CenteredMessageCardProps {
  message: string
  minHeight?: number
  typographyProps?: TypographyProps
}

const CenteredMessageCard = ({
  message,
  minHeight = 300,
  typographyProps,
}: CenteredMessageCardProps) => (
  <BlankCard>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        p: 4,
      }}
    >
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{
          fontWeight: 500,
          letterSpacing: 0.5,
        }}
        {...typographyProps}
      >
        {message}
      </Typography>
    </Box>
  </BlankCard>
)

export default CenteredMessageCard
