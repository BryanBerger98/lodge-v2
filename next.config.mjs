import NextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = NextBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
  
export default withBundleAnalyzer({
	eslint: { ignoreDuringBuilds: true },
	// typescript: { ignoreBuildErrors: true },
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'weberger-lodge-dev.s3.eu-west-3.amazonaws.com',
				port: '',
				pathname: '/**',
			},
		],
	}, 
});