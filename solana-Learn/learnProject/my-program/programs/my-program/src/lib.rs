use anchor_lang::prelude::*;

declare_id!("23vaWjdCzqz86Vz4DgvLLnx5U6kCrgg9GazijhDbw6ek");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
