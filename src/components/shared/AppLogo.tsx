import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
//import { APP_NAME } from '@/lib/constants'

const AppLogo = () => {
    return (
        <Link href="/" className='flex-start'>
            <div className=' flex flex-row items-end space-x-2'>
                <Image
                    src="/logo.png"
                    width={32}
                    height={32}
                    alt="teste"
                    priority
                />
                <span className='text-lg'>teste</span>
            </div>
        </Link>
    )
}

export default AppLogo;