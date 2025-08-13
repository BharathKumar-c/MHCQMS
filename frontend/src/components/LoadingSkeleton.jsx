import { Box, Skeleton } from '@mui/material'

const LoadingSkeleton = ({ type = 'card', lines = 3, height = 20 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <Box className="p-6 space-y-4">
            <Skeleton variant="rectangular" height={height * 2} className="rounded-xl" />
            <Skeleton variant="text" height={height} width="60%" />
            <Skeleton variant="text" height={height} width="40%" />
          </Box>
        )
      
      case 'table':
        return (
          <Box className="space-y-3">
            {Array.from({ length: lines }).map((_, index) => (
              <Box key={index} className="flex items-center space-x-4">
                <Skeleton variant="circular" width={40} height={40} />
                <Box className="flex-1 space-y-2">
                  <Skeleton variant="text" height={height} width="30%" />
                  <Skeleton variant="text" height={height - 4} width="60%" />
                </Box>
                <Skeleton variant="rectangular" height={24} width={80} className="rounded-full" />
              </Box>
            ))}
          </Box>
        )
      
      case 'list':
        return (
          <Box className="space-y-3">
            {Array.from({ length: lines }).map((_, index) => (
              <Box key={index} className="flex items-center space-x-3">
                <Skeleton variant="rectangular" height={height} width={height} className="rounded-lg" />
                <Box className="flex-1">
                  <Skeleton variant="text" height={height} width="70%" />
                </Box>
              </Box>
            ))}
          </Box>
        )
      
      case 'stats':
        return (
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Box key={index} className="p-6 space-y-3">
                <Box className="flex items-center justify-between">
                  <Skeleton variant="text" height={height * 2} width="40%" />
                  <Skeleton variant="circular" width={48} height={48} />
                </Box>
                <Skeleton variant="text" height={height} width="60%" />
              </Box>
            ))}
          </Box>
        )
      
      case 'form':
        return (
          <Box className="space-y-6">
            {Array.from({ length: lines }).map((_, index) => (
              <Box key={index} className="space-y-2">
                <Skeleton variant="text" height={height} width="30%" />
                <Skeleton variant="rectangular" height={height * 2.5} className="rounded-lg" />
              </Box>
            ))}
          </Box>
        )
      
      default:
        return (
          <Box className="space-y-2">
            {Array.from({ length: lines }).map((_, index) => (
              <Skeleton key={index} variant="text" height={height} />
            ))}
          </Box>
        )
    }
  }

  return (
    <Box className="animate-pulse">
      {renderSkeleton()}
    </Box>
  )
}

export default LoadingSkeleton
