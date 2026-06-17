import React from 'react'

/* Carte de prix — markup EXACT du port Sportix (classes Framer conservées, badge
   flottant d'origine). Aucun style modifié : on s'appuie sur framer.css. */

const CHECK = '/lppionnier/assets/framerusercontent.com/images/2sYRM8KAb54ZAad5lWhGRSg2I.svg'

function Feature({ text }: { text: string }) {
  return (
    <div className={'framer-j2v4og-container'} style={{ opacity: '1' }}>
      <div className={'framer-Pyzrn framer-gbuwA framer-1web91m framer-v-1web91m'} data-framer-name={'Default'} style={{ width: '100%', opacity: '1' }}>
        <div className={'framer-123ipd2'} data-framer-name={'Icon'} style={{ opacity: '1' }}>
          <div style={{ position: 'absolute', borderRadius: 'inherit', top: '0', right: '0', bottom: '0', left: '0' }}>
            <img decoding={'auto'} width={'24'} height={'25'} src={CHECK} alt={'Icon'} style={{ display: 'block', width: '100%', height: '100%', borderRadius: 'inherit', objectPosition: 'center', objectFit: 'cover' }} />
          </div>
        </div>
        <div className={'framer-r6i663'} data-framer-name={'Body'} style={{ '--extracted-r6o4lv': 'var(--token-97fc87a4-7472-48e0-baff-d882386fd651, rgb(0, 0, 0))', transform: 'none', opacity: '1' } as React.CSSProperties}>
          <p className={'framer-text framer-styles-preset-1116k3j'} data-styles-preset={'CclRS3ecL'} style={{ '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-97fc87a4-7472-48e0-baff-d882386fd651, rgb(0, 0, 0)))' } as React.CSSProperties}>
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}

export function PriceCard({ name, price, period, desc, features, href = '/contact', cta = "S'inscrire" }: { name: string; price: string; period: string; desc: string; features: string[]; href?: string; cta?: string }) {
  return (
    <div className={'framer-wbllb0-container'} style={{ willChange: 'transform', opacity: '1', transform: 'none' }}>
      <div className={'framer-jIlUe framer-fN9WN framer-AZnGt framer-1eSXM framer-gbuwA framer-1cwxg2b framer-v-1cwxg2b'} data-border={'true'} data-framer-name={'Default'} style={{ '--border-bottom-width': '1px', '--border-color': 'var(--token-8f4f0a97-886c-442e-9b68-fba0a777697e, rgb(229, 229, 229))', '--border-left-width': '1px', '--border-right-width': '1px', '--border-style': 'solid', '--border-top-width': '1px', backgroundColor: 'var(--token-5b150902-af7d-44cd-9806-3cf99a174e98, rgb(255, 255, 255))', width: '100%', borderRadius: '10px', opacity: '1' } as React.CSSProperties}>
        <div className={'framer-nt5fcz'} data-framer-name={'LAbel Wrapper'} style={{ backgroundColor: 'var(--token-ce7cac9b-68d2-43aa-b17a-9ff7b974f476, rgb(207, 231, 203))', borderRadius: '50px', opacity: '1' }}>
          <div className={'framer-16vg9cs'} data-framer-name={'Heading'} style={{ '--extracted-r6o4lv': 'var(--token-fcc50f27-48bf-4381-8929-2fd53a7bb0e3, rgb(55, 97, 49))', transform: 'none', opacity: '1' } as React.CSSProperties}>
            <p className={'framer-text framer-styles-preset-1hcnkal'} data-styles-preset={'G4jBfKTMe'} style={{ '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-fcc50f27-48bf-4381-8929-2fd53a7bb0e3, rgb(55, 97, 49)))' } as React.CSSProperties}>
              {name}
            </p>
          </div>
        </div>
        <div className={'framer-1kzcbcl'} data-framer-name={'Top Content Wrapper'} style={{ opacity: '1' }}>
          <div className={'framer-o4vb6l'} data-framer-name={'Price Wrapper'} style={{ opacity: '1' }}>
            <div className={'framer-10rsdus'} data-framer-name={'Price'} style={{ '--extracted-tcooor': 'var(--token-97fc87a4-7472-48e0-baff-d882386fd651, rgb(0, 0, 0))', transform: 'none', opacity: '1' } as React.CSSProperties}>
              <div className={'framer-text framer-styles-preset-i3xh9m'} data-styles-preset={'bpR_VXhdZ'} style={{ '--framer-text-alignment': 'left', '--framer-text-color': 'var(--extracted-tcooor, var(--token-97fc87a4-7472-48e0-baff-d882386fd651, rgb(0, 0, 0)))' } as React.CSSProperties}>
                {price}
              </div>
            </div>
            <div className={'framer-1puz0xw'} data-framer-name={'Padding Bottom'} style={{ opacity: '1' }}>
              <div className={'framer-1do8is4'} data-framer-name={'Price'} style={{ '--extracted-1w1cjl5': 'var(--token-c3674009-0fe5-49c4-b319-05dd4e6ff53e, rgb(64, 64, 64))', transform: 'none', opacity: '1' } as React.CSSProperties}>
                <h6 className={'framer-text framer-styles-preset-gmdg5a'} data-styles-preset={'XCvretOoF'} style={{ '--framer-text-alignment': 'left', '--framer-text-color': 'var(--extracted-1w1cjl5, var(--token-c3674009-0fe5-49c4-b319-05dd4e6ff53e, rgb(64, 64, 64)))' } as React.CSSProperties}>
                  {period}
                </h6>
              </div>
            </div>
          </div>
          <div className={'framer-k9q449'} data-framer-name={'Body'} style={{ '--extracted-r6o4lv': 'var(--token-c3674009-0fe5-49c4-b319-05dd4e6ff53e, rgb(64, 64, 64))', transform: 'none', opacity: '1' } as React.CSSProperties}>
            <p className={'framer-text framer-styles-preset-1116k3j'} data-styles-preset={'CclRS3ecL'} style={{ '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-c3674009-0fe5-49c4-b319-05dd4e6ff53e, rgb(64, 64, 64)))' } as React.CSSProperties}>
              {desc}
            </p>
          </div>
        </div>
        <div className={'framer-ehqcyh'} data-border={'true'} data-framer-name={'Bottom Text Wrapper'} style={{ '--border-bottom-width': '1px', '--border-color': 'var(--token-8f4f0a97-886c-442e-9b68-fba0a777697e, rgb(229, 229, 229))', '--border-left-width': '1px', '--border-right-width': '1px', '--border-style': 'solid', '--border-top-width': '1px', backgroundColor: 'var(--token-c7f7b4a7-d22a-4efb-a894-f6581be9e186, rgb(245, 245, 245))', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', opacity: '1' } as React.CSSProperties}>
          <div className={'framer-8ey6gv'} data-framer-name={'List Wrapper'} style={{ opacity: '1' }}>
            {features.map((f, i) => (<Feature key={i} text={f} />))}
          </div>
          <div className={'framer-q3veeh-container'} style={{ opacity: '1' }}>
            <a className={'framer-mAcoc framer-X8adU framer-5jm32v framer-v-5jm32v framer-5eqsdb'} data-framer-name={'Default'} style={{ backdropFilter: 'blur(0px)', backgroundColor: 'var(--token-fcc50f27-48bf-4381-8929-2fd53a7bb0e3, rgb(55, 97, 49))', width: '100%', borderRadius: '70px', opacity: '1' }} href={href}>
              <div className={'framer-145drjp'} style={{ '--extracted-r6o4lv': 'var(--variable-reference-ypfpfVkT4-gRwIgGm9Y)', '--variable-reference-ypfpfVkT4-gRwIgGm9Y': 'var(--token-5b150902-af7d-44cd-9806-3cf99a174e98, rgb(255, 255, 255))', transform: 'none', opacity: '1' } as React.CSSProperties}>
                <p className={'framer-text framer-styles-preset-13c7ysj'} data-styles-preset={'QchegEuzx'} style={{ '--framer-text-color': 'var(--extracted-r6o4lv, var(--variable-reference-ypfpfVkT4-gRwIgGm9Y))' } as React.CSSProperties}>
                  {cta}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
