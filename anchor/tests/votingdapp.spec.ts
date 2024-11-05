import * as anchor from '@coral-xyz/anchor';
import {Program} from '@coral-xyz/anchor';
import {Keypair, PublicKey} from '@solana/web3.js';
import {Votingdapp} from '../target/types/votingdapp';
import { BankrunProvider } from "anchor-bankrun";
import { startAnchor } from "anchor-bankrun";

const IDL = require('../target/idl/votingdapp.json');

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('Votingdapp', () => {

  it('Initialize Poll', async () => {

    const context = await startAnchor("", [{name: "Votingdapp", programId: votingAddress}], []);

	const provider = new BankrunProvider(context);

  const votingdappProgram = new Program<Votingdapp>(
		IDL,
		provider,
	);

  await votingdappProgram.methods.initializePoll(
    new anchor.BN(1),
    "what is your favorite mockctail",
    new anchor.BN(0),
    new anchor.BN(1830808685),
  ).rpc();

  const [pollAddress] = PublicKey.findProgramAddressSync(
    [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
    votingAddress,
  )

  const poll  = await votingdappProgram.account.poll.fetch(pollAddress);

  console.log(poll);

  expect(poll.pollId.toNumber()).toEqual(1);
  expect(poll.description).toEqual("what is your favorite mockctail");
  expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

  });

});
