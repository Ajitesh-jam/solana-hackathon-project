use anchor_lang::prelude::*;

declare_id!("7EPPaFDtLHCFxpV2asQbmVyLJRHmjfYxMfcMT6UfBXk2");

#[program]
pub mod anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
