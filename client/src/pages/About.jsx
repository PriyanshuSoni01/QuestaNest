import React from 'react'

export default function About() {
  return (
    <div className='w-full bg-black/90'>
    <div className="py-16 px-4 w-[100%]  max-w-6xl text-orange-100  shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-orange-400">About QuestaNest</h1>
      <p className="mb-4 text-orange-200">
        At <span className="font-semibold text-orange-300">Questanest</span>, we don't just find properties—we find <span className="italic">homes</span> where dreams take root. As a premier real estate agency, we specialize in guiding buyers, sellers, and renters through the most sought-after neighborhoods with unmatched expertise and passion.
      </p>
  
      <h2 className="text-xl font-bold mt-8 mb-4 text-orange-400">Why Choose QuestaNest?</h2>
      <ul className="mb-4 text-orange-200 space-y-2">
        <li className="flex items-start">
          <span className="mr-2 text-orange-400">✔</span>
          <span>
            <span className="font-semibold text-orange-300">Expert Guidance</span> – Our seasoned agents bring deep market knowledge and sharp negotiation skills to ensure you get the best deal.
          </span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-orange-400">✔</span>
          <span>
            <span className="font-semibold text-orange-300">Personalized Service</span> – We listen, understand, and tailor our approach to match your unique real estate goals.
          </span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-orange-400">✔</span>
          <span>
            <span className="font-semibold text-orange-300">Seamless Experience</span> – From first search to final keys, we make buying, selling, or renting effortless and exciting.
          </span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-orange-400">✔</span>
          <span>
            <span className="font-semibold text-orange-300">Trusted Partnerships</span> – We build lasting relationships, not just transactions, because your success is our legacy.
          </span>
        </li>
      </ul>
  
      <p className="mb-4 text-orange-200">
        Whether you're searching for a cozy starter home, a luxury estate, or a smart investment, <span className="font-semibold text-orange-300">Questanest</span> is your trusted partner in turning real estate aspirations into reality.
      </p>
  
      <p className="text-lg font-medium mt-6 text-orange-400">
        Your journey begins here. Let's find your perfect Nest.
      </p>
    </div>
    </div>
  )
}