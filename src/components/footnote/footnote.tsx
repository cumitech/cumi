import React from 'react'
import {
	FacebookFilled,
	TwitterSquareFilled,
	LinkedinFilled,
	GithubFilled
} from '@ant-design/icons'
import styles from './footnote.module.css'

export const AppFootnote = () => {
	return (
		<section className={`section ${styles.section}`}>
			<div className='container bg-lightt'>
				<div className={styles.content}>
					<div className={styles.content_group_social}>
						<a 
							href='https://web.facebook.com/ayeahgodlove/?_rdc=1&_rdr' 
							target='_blank' 
							rel='noopener noreferrer'
							aria-label='Facebook Profile'
						>
							<FacebookFilled />
						</a>
						<a 
							href='https://twitter.com/GodloveAyeah' 
							target='_blank' 
							rel='noopener noreferrer'
							aria-label='Twitter Profile'
						>
							<TwitterSquareFilled />
						</a>
						<a 
							href='https://www.linkedin.com/in/ayeah-godlove-akoni-0820a0164/' 
							target='_blank' 
							rel='noopener noreferrer'
							aria-label='LinkedIn Profile'
						>
							<LinkedinFilled />
						</a>
						<a 
							href='https://github.com/ayeahgodlove' 
							target='_blank' 
							rel='noopener noreferrer'
							aria-label='GitHub Profile'
						>
							<GithubFilled />
						</a>
					</div>
					<div className={styles.content_group_text}>
						<a href='/terms-of-use'>Terms of Use</a>
						<a href='/privacy-policy'>Privacy Policy</a>
						<span>All rights reserved © Cumi Inc.</span>
					</div>
				</div>
			</div>
		</section>
	)
}
