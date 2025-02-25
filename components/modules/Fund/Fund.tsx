"use client"

import FundDonate from "./FundDonate"
import starknetlogo from "@/public/icons/starklogo.png"
import { FundVote } from "./FundVote"
import { useEffect, useState } from "react"
import { FUND_MANAGER_ADDR, provider, upVotesNeeded } from "@/constants"
import Divider from "@/components/ui/Divider"
import { fundAbi } from "@/contracts/abis/fund"
import { fundManager } from "@/contracts/abis/fundManager"
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet"
import { useAtomValue } from "jotai"
import { Contract } from "starknet"
import { clickedFundState } from "@/state/nFunds"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { FundWithdraw } from "./FundWithdraw"
import { Link } from 'lucide-react';

const Fund = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom)
  const [fund, setFund] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [activeTab, setActiveTab] = useState("overview");

  const dummyDonators = [
    { rank: 1, donatorAddress: "0xA1B2C3...D4E5", donatorAmount: "150 STRK" },
    { rank: 2, donatorAddress: "0xB1C2D3...E4F5", donatorAmount: "120 STRK" },
    { rank: 3, donatorAddress: "0xC1D2E3...F4G5", donatorAmount: "100 STRK" },
    { rank: 4, donatorAddress: "0xD1E2F3...G4H5", donatorAmount: "90 STRK" },
    { rank: 5, donatorAddress: "0xE1F2G3...H4I5", donatorAmount: "80 STRK" },
    { rank: 6, donatorAddress: "0xF1G2H3...I4J5", donatorAmount: "70 STRK" },
    { rank: 7, donatorAddress: "0xG1H2I3...J4K5", donatorAmount: "60 STRK" },
    { rank: 8, donatorAddress: "0xH1I2J3...K4L5", donatorAmount: "50 STRK" },
    { rank: 9, donatorAddress: "0xI1J2K3...L4M5", donatorAmount: "40 STRK" },
    { rank: 10, donatorAddress: "0xJ1K2L3...M4N5", donatorAmount: "30 STRK" },
  ];

  const clickedFund = useAtomValue(clickedFundState)

  async function getDetails() {
    const fundManagerContract = new Contract(fundManager, FUND_MANAGER_ADDR, provider)
    let addr = await fundManagerContract.get_fund(clickedFund?.id)
    addr = "0x" + addr.toString(16)
    const fundContract = new Contract(fundAbi, addr, provider)
    try {
      // Fetch fund details
      const name = await fundContract.get_name()
      let desc = await fundContract.get_reason()
      if (desc == " ") {
        desc = "No description provided"
      }
      const state = await fundContract.get_state()
      let currentBalance = await fundContract.get_current_goal_state()
      currentBalance = BigInt(currentBalance) / BigInt(10 ** 18)
      let goal = await fundContract.get_goal()
      goal = BigInt(goal) / BigInt(10 ** 18)
      const upVotes = await fundContract.get_up_votes()
      const evidenceLink = await fundContract.get_evidence_link()
      const contactHandle = await fundContract.get_contact_handle()
      // Fetch owner
      setIsOwner(await fundContract.is_owner(wallet != undefined ? wallet?.account.address : "0x00000000"))
      // USER VOTED?
      const voted = await fundContract.get_voter(wallet != undefined ? wallet?.account.address : "0x0000000000")

      setFund({
        name: name,
        desc: desc,
        state: state,
        currentBalance: currentBalance,
        goal: goal,
        upVotes: upVotes,
        addr: addr,
        evidenceLink: evidenceLink,
        contactHandle: contactHandle,
        voted: voted,
      })
    } catch (error) {
      console.error("Error fetching fund details:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetails()
  })

  return (
    <>
      {loading && (
        <div className="text-center text-gray-500 mt-12">
          <LoadingSpinner />
          <div className="text-center text-gray-500">Loading funding...</div>
        </div>
      )}
      {!loading && (
        <section>
          <h1 className="font-bold text-2xl pb-6">{fund.name}</h1>

          {/* Tabs Navigation */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 ${
                activeTab === "overview" ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("donators")}
              className={`px-4 py-2 ${
                activeTab === "donators" ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"
              }`}
            >
              Top Donators
            </button>
          </div>

          {activeTab === "overview" && (
            <>
              <div className="rounded-lg border border-gray-300 border-b-2 border-b-gray-400 bg-white p-8 shadow-sm mb-6">
                <h2 className="text-xl mb-4 font-bold">Description</h2>
                <p className="text-gray-700 pb-6">{fund.desc}</p>
              </div>

              <div className="rounded-lg border border-gray-300 border-b-2 border-b-gray-400 bg-white p-8 shadow-sm mb-6">
                <h2 className="text-xl mb-4 font-bold">Fund details</h2>
                <p className=" text-gray-500 flex items-center gap-2 pb-2">
                  Evidence link
                  <Link size={18} />
                </p>
                  <a href={fund.evidenceLink} className="text-[#8F4FFA] text-lg pb-2" target="_blank" rel="noreferrer">
                    {fund.evidenceLink}
                  </a>
                <p className=" text-gray-500 flex items-center gap-2 pb-2 pt-2">
                  Contact handle
                  <Link size={18} />
                </p>
                <a href={fund.contactHandle} className="text-[#8F4FFA] text-lg pb-2" target="_blank" rel="noreferrer">
                  {fund.contactHandle}
                </a>
              </div>

              <div className="rounded-lg border border-gray-300 border-b-2 border-b-gray-400 bg-white p-8 shadow-sm mb-6">
              {Number(fund.state) === 0 && <p>Fund is currently inactive.</p>}
              {Number(fund.state) === 1 && (
                <>
                  <h2 className="text-xl mb-4 font-bold">Fund votes</h2>
                  <FundVote
                    name={fund.name}
                    upVotes={fund.upVotes}
                    upVotesNeeded={upVotesNeeded}
                    addr={fund.addr}
                    setLoading={setLoading}
                    voted={fund.voted}
                  />
                </>
              )}
              {Number(fund.state) === 2 && !isOwner && (
                <>
                  <FundDonate
                    currentBalance={fund.currentBalance}
                    goal={fund.goal}
                    addr={fund.addr}
                    name={fund.name}
                    icon={starknetlogo}
                  />
                </>
              )}
              {Number(fund.state) === 3 && !isOwner && (
                <>
                  <FundDonate
                    currentBalance={fund.currentBalance}
                    goal={fund.goal}
                    addr={fund.addr}
                    name={fund.name}
                    icon={starknetlogo}
                  />
                </>
              )}
              {Number(fund.state) === 2 && isOwner && (
                <>
                  <FundDonate
                    currentBalance={fund.currentBalance}
                    goal={fund.goal}
                    addr={fund.addr}
                    name={fund.name}
                    icon={starknetlogo}
                  />
                </>
              )}
              {Number(fund.state) === 3 && isOwner && (
                <FundWithdraw
                  currentBalance={fund.currentBalance}
                  goal={fund.goal}
                  addr={fund.addr}
                  setLoading={setLoading}
                  getDetails={getDetails}
                />
              )}
              {Number(fund.state) === 4 && <p>Fund was already withdrawn.</p>}
              </div>
            </>
          )}

          {activeTab === "donators" && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">🥇 Rank</th>
                    <th className="px-4 py-2">Donator Address</th>
                    <th className="px-4 py-2">Donator Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyDonators.map((donator) => (
                    <tr key={donator.rank} className="border-b">
                      <td className="px-4 py-2">{donator.rank}</td>
                      <td className="px-4 py-2">{donator.donatorAddress}</td>
                      <td className="px-4 py-2">{donator.donatorAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </>
  )
}

export default Fund

