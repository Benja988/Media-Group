codeunit 50017 "Charge Penalty Mobile Loans"
{
    var
        Cust: Record Customer;
        LoanRepSch: Record "Loan Repayment Schedule";
        LoanApplicationSetup: Record "Loan Application Setup";
        GlobalManagement: Codeunit "Global Management";
        BOSAManagement: Codeunit "BOSA Management";
        LoanProductType: Record "Loan Product Type";
        SourceCodeSetup: Record "Source Code Setup";
        TransactionTypeCodeSetup: Record "Transaction Type Code Setup";
        Member: Record Member;
        CustL: Record "Cust. Ledger Entry";
        DCustL: Record "Detailed Cust. Ledg. Entry";
        LoanApp: Record "Loan Application";
        GenJournalLine: Record "Gen. Journal Line";
        GenJnlPostBatch: Codeunit "Gen. Jnl.-Post Batch";

        Text000: Label 'Penalty Charged-';
        PostingDate: Date;

        PenaltyDue: Decimal;
        AmountPaid: Decimal;
        OutBal: Decimal;
        intBal: Decimal;
        princBal: Decimal;
        penBal: Decimal;

        AccountTypeEnum: Enum "Gen. Journal Account Type";
        BalAccountTypeEnum: Enum "Gen. Journal Account Type";
        AppliesToDocTypeEnum: Enum "Gen. Journal Document Type";

    trigger OnRun()
    begin
        ChargePenalty();
    end;

    procedure ChargePenalty()
    begin
        PostingDate := Today;

        LoanApplicationSetup.Get();
        GlobalManagement.ClearJournal(
            LoanApplicationSetup."Penalty Template Name",
            LoanApplicationSetup."Penalty Batch Name");

        LoanApp.Reset();
        LoanApp.SetRange(Posted, true);

        if LoanApp.FindSet() then
            repeat
                LoanApp.CalcFields("Outstanding Balance");
                LoanProductType.Get(LoanApp."Loan Product Type");

                if LoanProductType."E-Loan" then begin
                    if LoanApp."Outstanding Balance" > 0 then begin
                        Cust.Get(LoanApp."No.");

                        LoanRepSch.Reset();
                        LoanRepSch.SetRange("Loan No.", LoanApp."No.");
                        LoanRepSch.SetFilter("Repayment Date", '..%1', PostingDate);

                        if LoanRepSch.FindSet() then
                            repeat
                                ProcessPenaltyForSchedule(LoanRepSch, Cust, PostingDate);
                            until LoanRepSch.Next() = 0;
                    end;
                end;
            until LoanApp.Next() = 0;

        // ------------------------------------
        // POST PENALTY JOURNALS FIRST
        // ------------------------------------
        GenJournalLine.Reset();
        GenJournalLine.SetRange("Journal Template Name", LoanApplicationSetup."Penalty Template Name");
        GenJournalLine.SetRange("Journal Batch Name", LoanApplicationSetup."Penalty Batch Name");

        if GenJournalLine.FindSet() then
            GenJnlPostBatch.Run(GenJournalLine);

        // ------------------------------------
        // CLEAR JOURNAL FOR RECOVERIES
        // ------------------------------------
        GlobalManagement.ClearJournal(
            LoanApplicationSetup."Penalty Template Name",
            LoanApplicationSetup."Penalty Batch Name");

        // ------------------------------------
        // SECOND PASS FOR RECOVERIES
        // ------------------------------------
        LoanApp.Reset();
        LoanApp.SetRange(Posted, true);

        if LoanApp.FindSet() then
            repeat
                LoanApp.CalcFields("Outstanding Balance");
                LoanProductType.Get(LoanApp."Loan Product Type");

                if LoanProductType."E-Loan" then begin
                    if LoanApp."Outstanding Balance" > 0 then begin
                        Cust.Get(LoanApp."No.");

                        LoanRepSch.Reset();
                        LoanRepSch.SetRange("Loan No.", LoanApp."No.");
                        LoanRepSch.SetFilter("Repayment Date", '..%1', PostingDate);

                        if LoanRepSch.FindSet() then
                            repeat
                                ProcessRecoveryForSchedule(LoanRepSch, Cust, PostingDate);
                            until LoanRepSch.Next() = 0;
                    end;
                end;
            until LoanApp.Next() = 0;

        // ------------------------------------
        // POST RECOVERY JOURNALS
        // ------------------------------------
        GenJournalLine.Reset();
        GenJournalLine.SetRange("Journal Template Name", LoanApplicationSetup."Penalty Template Name");
        GenJournalLine.SetRange("Journal Batch Name", LoanApplicationSetup."Penalty Batch Name");

        if GenJournalLine.FindSet() then
            GenJnlPostBatch.Run(GenJournalLine);
    end;

    procedure ProcessPenaltyForSchedule(
        RepSch: Record "Loan Repayment Schedule";
        Cust: Record Customer;
        PostingDate: Date)
    var
        MonthsOverdue: Integer;
    begin
        MonthsOverdue := GetMonthsOverdue(RepSch."Repayment Date", PostingDate);

        if MonthsOverdue <= 0 then
            exit;

        if MonthsOverdue > 2 then
            MonthsOverdue := 2;

        LoanApp.Reset();
        LoanApp.SetRange("No.", RepSch."Loan No.");

        if not LoanApp.FindFirst() then
            exit;

        LoanApp.CalcFields("Outstanding Balance");
        if LoanApp."Outstanding Balance" <= 0 then
            exit;

        // -----------------------------
        // MONTH 1: penalty only
        // -----------------------------
        if MonthsOverdue = 1 then begin
            CapitalizePenaltyMob(
                Cust,
                RepSch."Repayment Date",
                PostingDate,
                LoanApp);
        end;

        // -----------------------------
        // MONTH 2: penalty only (recovery moved out)
        // -----------------------------
        if MonthsOverdue = 2 then begin
            CapitalizePenaltyMob(
                Cust,
                CalcDate('1M', RepSch."Repayment Date"),
                PostingDate,
                LoanApp);
        end;
    end;

    procedure ProcessRecoveryForSchedule(
        RepSch: Record "Loan Repayment Schedule";
        Cust: Record Customer;
        PostingDate: Date)
    var
        MonthsOverdue: Integer;
        RecoveryPostDate: Date;
        RunDate: Date;
    begin
        MonthsOverdue := GetMonthsOverdue(RepSch."Repayment Date", PostingDate);

        if MonthsOverdue < 2 then
            exit;

        RunDate := CalcDate('1M', RepSch."Repayment Date");
        RecoveryPostDate := CalcDate('CM', RunDate);

        RecoverFromDeposits(Cust, RecoveryPostDate);
    end;

    procedure GetMonthsOverdue(RepaymentDate: Date; PostingDate: Date) Result: Integer
    var
        RepDay, RepMonth, RepYear : Integer;
        PostDay, PostMonth, PostYear : Integer;
    begin
        Result := 0;

        if PostingDate <= RepaymentDate then
            exit;

        // Extract day, month, year from RepaymentDate
        RepDay := Date2DMY(RepaymentDate, 1);
        RepMonth := Date2DMY(RepaymentDate, 2);
        RepYear := Date2DMY(RepaymentDate, 3);

        // Extract day, month, year from PostingDate
        PostDay := Date2DMY(PostingDate, 1);
        PostMonth := Date2DMY(PostingDate, 2);
        PostYear := Date2DMY(PostingDate, 3);

        // Calculate months difference
        Result := (PostYear - RepYear) * 12 + (PostMonth - RepMonth);

        // Subtract 1 if Posting day < Repayment day (partial month not counted)
        if PostDay < RepDay then
            Result -= 1;

        // Cap at 2 months
        if Result > 2 then
            Result := 2;
    end;

    // =====================================================
    // Capitalize penalty (monthly safe)
    // =====================================================
    procedure CapitalizePenaltyMob(
        Customer: Record Customer;
        RunDate: Date;
        PostingDate: Date;
        Loan: Record "Loan Application")
    var
        PenaltyPostDate: Date;
    begin
        AmountPaid := 0;

        PenaltyPostDate := CalcDate('CM', RunDate);

        LoanApplicationSetup.Get();
        SourceCodeSetup.Get();
        TransactionTypeCodeSetup.Get();
        LoanProductType.Get(Customer."Customer Posting Group");

        Loan.SetFilter("Date Filter", '..%1', PenaltyPostDate);
        Loan.CalcFields("Outstanding Balance");
        OutBal := Loan."Outstanding Balance";

        if OutBal <= 0 then
            exit;

        CustL.Reset();
        CustL.SetRange("Customer No.", Customer."No.");
        CustL.SetFilter(
            "Posting Date",
            Format(RunDate) + '..' + Format(CalcDate('CM', RunDate)));
        CustL.SetFilter(
            "Transaction Type Code",
            '%1|%2',
            TransactionTypeCodeSetup."Principal Paid",
            TransactionTypeCodeSetup."Loan Prepayment");
        CustL.SetRange(Reversed, false);

        if CustL.FindSet() then
            repeat
                CustL.CalcFields("Credit Amount");
                AmountPaid += CustL."Credit Amount";
            until CustL.Next() = 0;

        if AmountPaid <> 0 then
            exit;

        PenaltyDue := Round((10 / 100) * OutBal, 1, '=');

        CustL.Reset();
        CustL.SetRange("Customer No.", Customer."No.");
        CustL.SetRange(Reversed, false);
        CustL.SetFilter(
            "Posting Date",
            Format(RunDate) + '..' + Format(CalcDate('CM', RunDate)));
        CustL.SetRange("Transaction Type Code", 'PENDUE');

        if CustL.FindFirst() then
            exit;

        GlobalManagement.CreateJournal(
            LoanApplicationSetup."Penalty Template Name",
            LoanApplicationSetup."Penalty Batch Name",
            'PEN-' + Format(RunDate),
            Customer."No.",
            PenaltyPostDate,
            AccountTypeEnum::Customer,
            Customer."No.",
            Text000 + Customer."No.",
            PenaltyDue,
            LoanProductType."Penalty Paid Posting Group",
            TransactionTypeCodeSetup."Penalty Due",
            SourceCodeSetup.Loan,
            '',
            BalAccountTypeEnum::"G/L Account",
            '',
            AppliesToDocTypeEnum::" ",
            '');

        GlobalManagement.CreateJournal(
            LoanApplicationSetup."Penalty Template Name",
            LoanApplicationSetup."Penalty Batch Name",
            'PEN-' + Format(RunDate),
            Customer."No.",
            PenaltyPostDate,
            AccountTypeEnum::"G/L Account",
            LoanProductType."Penalty Paid Posting Group",
            Text000 + Customer."No.",
            -PenaltyDue,
            '',
            '',
            SourceCodeSetup.Loan,
            '',
            BalAccountTypeEnum::"G/L Account",
            '',
            AppliesToDocTypeEnum::" ",
            '');
    end;

    // =====================================================
    // Recovery + blocking
    // =====================================================
    procedure RecoverFromDeposits(var Customer: Record Customer; PostingDate: Date)
    var
        DepositBalance: Decimal;
        DepositAcc: Code[20];
        TotalRecovery: Decimal;
        BosaM: Codeunit "BOSA Management";
        Recovered: Decimal;
        PrincRec: Decimal;
        IntRec: Decimal;
        PenRec: Decimal;
        Remaining: Decimal;
    begin
        LoanApplicationSetup.Get();

        if not Member.Get(BOSAManagement.fnGetmemberNo(Customer."No.")) then
            exit;

        // ------------------------------------------------
        // PREVENT DOUBLE RECOVERY
        // ------------------------------------------------
        /* if Member."Mobile Loan Blocked" then
            exit; */

        penBal := 0;
        intBal := 0;
        princBal := 0;

        // ------------------------------------------------
        // Calculate outstanding balances
        // ------------------------------------------------
        DCustL.Reset();
        DCustL.SetRange("Customer No.", Customer."No.");
        DCustL.SetFilter("Posting Date", '..%1', PostingDate);

        if DCustL.FindSet() then
            repeat
                case DCustL."Transaction Type Code" of
                    'PENDUE', 'PENPAID':
                        penBal += DCustL.Amount;
                    'INTDUE', 'INTPAID':
                        intBal += DCustL.Amount;
                    'NEWLOAN', 'PPAID':
                        princBal += DCustL.Amount;
                end;
            until DCustL.Next() = 0;

        TotalRecovery := Abs(penBal + intBal + princBal);

        if TotalRecovery = 0 then
            exit;

        DepositBalance :=
            (BosaM.GetDepositAccountBalance(Member."No.", PostingDate)) * -1;

        DepositAcc :=
            BosaM.GetDepositAccount(Member."No.");

        // ------------------------------------------------
        // Calculate recovery amounts in order: principal, interest, penalty
        // ------------------------------------------------
        Recovered := DepositBalance;
        if TotalRecovery < Recovered then
            Recovered := TotalRecovery;

        PrincRec := Recovered;
        if princBal < PrincRec then
            PrincRec := princBal;
        Recovered -= PrincRec;

        IntRec := Recovered;
        if intBal < IntRec then
            IntRec := intBal;
        Recovered -= IntRec;

        PenRec := Recovered;
        if penBal < PenRec then
            PenRec := penBal;

        LoanProductType.Get(Customer."Customer Posting Group");

        // ------------------------------------------------
        // PRINCIPAL RECOVERY
        // ------------------------------------------------
        if PrincRec <> 0 then begin
            GlobalManagement.CreateJournal(
                LoanApplicationSetup."Penalty Template Name",
                LoanApplicationSetup."Penalty Batch Name",
                'REC-' + Format(PostingDate),
                DepositAcc,
                PostingDate,
                AccountTypeEnum::Vendor,
                DepositAcc,
                'Principal recovered from deposits ' + Customer."No.",
                PrincRec,
                '',
                '',
                SourceCodeSetup.Loan,
                '',
                BalAccountTypeEnum::"G/L Account",
                '',
                AppliesToDocTypeEnum::" ",
                '');

            GlobalManagement.CreateJournal(
                LoanApplicationSetup."Penalty Template Name",
                LoanApplicationSetup."Penalty Batch Name",
                'REC-' + Format(PostingDate),
                Customer."No.",
                PostingDate,
                AccountTypeEnum::Customer,
                Customer."No.",
                'Principal recovered from deposits ' + Customer."No.",
                -PrincRec,
                LoanProductType."Loan Posting Group",
                'PPAID',
                SourceCodeSetup.Loan,
                '',
                BalAccountTypeEnum::"G/L Account",
                '',
                AppliesToDocTypeEnum::" ",
                '');
        end;

        // ------------------------------------------------
        // INTEREST RECOVERY
        // ------------------------------------------------
        if IntRec <> 0 then begin
            GlobalManagement.CreateJournal(
                LoanApplicationSetup."Penalty Template Name",
                LoanApplicationSetup."Penalty Batch Name",
                'REC-' + Format(PostingDate),
                DepositAcc,
                PostingDate,
                AccountTypeEnum::Vendor,
                DepositAcc,
                'Interest recovered from deposits ' + Customer."No.",
                IntRec,
                '',
                '',
                SourceCodeSetup.Loan,
                '',
                BalAccountTypeEnum::"G/L Account",
                '',
                AppliesToDocTypeEnum::" ",
                '');

            GlobalManagement.CreateJournal(
                LoanApplicationSetup."Penalty Template Name",
                LoanApplicationSetup."Penalty Batch Name",
                'REC-' + Format(PostingDate),
                Customer."No.",
                PostingDate,
                AccountTypeEnum::Customer,
                Customer."No.",
                'Interest recovered from deposits ' + Customer."No.",
                -IntRec,
                LoanProductType."Interest Due Posting Group",
                'INTPAID',
                SourceCodeSetup.Loan,
                '',
                BalAccountTypeEnum::"G/L Account",
                '',
                AppliesToDocTypeEnum::" ",
                '');
        end;

        // ------------------------------------------------
        // PENALTY RECOVERY
        // ------------------------------------------------
        if PenRec <> 0 then begin
            GlobalManagement.CreateJournal(
                LoanApplicationSetup."Penalty Template Name",
                LoanApplicationSetup."Penalty Batch Name",
                'REC-' + Format(PostingDate),
                DepositAcc,
                PostingDate,
                AccountTypeEnum::Vendor,
                DepositAcc,
                'Penalty recovered from deposits ' + Customer."No.",
                PenRec,
                '',
                '',
                SourceCodeSetup.Loan,
                '',
                BalAccountTypeEnum::"G/L Account",
                '',
                AppliesToDocTypeEnum::" ",
                '');

            GlobalManagement.CreateJournal(
                LoanApplicationSetup."Penalty Template Name",
                LoanApplicationSetup."Penalty Batch Name",
                'REC-' + Format(PostingDate),
                Customer."No.",
                PostingDate,
                AccountTypeEnum::Customer,
                Customer."No.",
                'Penalty recovered from deposits ' + Customer."No.",
                -PenRec,
                LoanProductType."Penalty Due Posting Group",
                'PENPAID',
                SourceCodeSetup.Loan,
                '',
                BalAccountTypeEnum::"G/L Account",
                '',
                AppliesToDocTypeEnum::" ",
                '');
        end;

        // ------------------------------------------------
        // BLOCK + LIEN
        // ------------------------------------------------
        Member."Mobile Loan Blocked" := true;
        Member."Blocked Until" := CalcDate('3M', PostingDate);

        Remaining := TotalRecovery - (PrincRec + IntRec + PenRec);
        Member."Deposit Lien Amount" := Remaining;

        Member.Modify();
    end;




}






/* codeunit 50017 "Charge Penalty Mobile Loans"
{
    var
        Cust: Record Customer;
        LoanRepSch: Record "Loan Repayment Schedule";
        disbursalDate: Date;
        "Loan Application": Record "Loan Application";
        LoanApplicationSetup: Record "Loan Application Setup";
        GlobalManagement: Codeunit "Global Management";
        RunDate: Date;
        BOSAManagement: Codeunit "BOSA Management";
        LoanApplication: Record "Loan Application";
        LoanProductType: Record "Loan Product Type";
        Text000: Label 'Penalty Charged-';
        CustomerPostingGroup: Record "Customer Posting Group";
        PenaltyDue: Decimal;
        Outbal: Decimal;
        DCustL: Record "Detailed Cust. Ledg. Entry";
        DFilter: Text[100];
        AmoutInArrears: array[4] of Decimal;
        Overpayment: array[2] of Decimal;
        TotalArrears: Decimal;
        LoanRepaymentSchedule: Record "Loan Repayment Schedule";
        TotalMonthlyRepayment: Decimal;
        AmountPaid: Decimal;
        MonthDateFilter: Text;
        Prepayment: Decimal;
        dateDiff: Integer;
        penAmt: Decimal;
        PenCharged: Decimal;
        defaulterLoanNo: Code[35];
        intBal: Decimal;
        princBal: Decimal;
        penBal: Decimal;
        SourceCodeSetup: Record "Source Code Setup";
        TransactionTypeCodeSetup: Record "Transaction Type Code Setup";
        AccountTypeEnum: Enum "Gen. Journal Account Type";
        BalAccountTypeEnum: Enum "Gen. Journal Account Type";
        AppliesToDocTypeEnum: Enum "Gen. Journal Document Type";
        JournalTemplateName: Code[20];
        JournalBatchName: Code[20];
        Member: Record Member;
        CustL: Record "Cust. Ledger Entry";
        GenJournalLine: Record "Gen. Journal Line";
        GenJnlPostBatch: Codeunit "Gen. Jnl.-Post Batch";
        postingDate: Date;
        LoanApp: Record "Loan Application";

    trigger OnRun()
    begin
        //  for postingDate := 20240101D To Today do begin
        postingDate := Today;
        LoanApplicationSetup.Get();
        GlobalManagement.ClearJournal(LoanApplicationSetup."Penalty Template Name", LoanApplicationSetup."Penalty Batch Name");

        "Loan Application".Reset();
        "Loan Application".SetRange(Posted, true);
        //"Loan Application".SetFilter("Date Filter", '..%1', postingDate);
        if "Loan Application".FindSet() then begin
            repeat
                "Loan Application".CalcFields("Outstanding Balance");
                LoanProductType.Get("Loan Application"."Loan Product Type");
                If LoanProductType."E-Loan" = true then begin
                    "Loan Application".CalcFields("Outstanding Balance");
                    if "Loan Application"."Outstanding Balance" > 0 then begin
                        Cust.Get("Loan Application"."No.");
                        if "Loan Application"."Date of Completion" >= postingDate then begin
                            LoanRepSch.Reset();
                            LoanRepSch.SetRange("Loan No.", "Loan Application"."No.");
                            LoanRepSch.SetRange("Repayment Date", postingDate);
                            if LoanRepSch.FindFirst() then begin
                                LoanApp.Reset();
                                LoanApp.SetRange("No.", "Loan Application"."No.");
                                LoanApp.SetFilter("Date Filter", '..%1', postingDate);
                                If LoanApp.FindFirst() then begin
                                    LoanApp.CalcFields("Outstanding Balance");
                                    CapitalizePenaltyMob(Cust, "Loan Application"."Disbursal Date", postingDate, LoanApp);
                                end;
                            end;
                        end else begin
                            if CalcDate('1M', "Loan Application"."Date of Completion") = postingDate then begin
                                CreateMobileDefaultLoan(Cust, postingDate);
                            end;
                        end;
                    end;
                end;
            until "Loan Application".Next = 0;
        end;

        GenJournalLine.RESET;
        GenJournalLine.SETRANGE("Journal Template Name", LoanApplicationSetup."Penalty Template Name");
        GenJournalLine.SETRANGE("Journal Batch Name", LoanApplicationSetup."Penalty Batch Name");
        IF GenJournalLine.FINDSET THEN BEGIN
            GenJnlPostBatch.RUN(GenJournalLine);
        end;
    end;




    procedure CapitalizePenaltyMob(Customer: Record Customer; RunDate: Date; PostingDate: Date; Loan: Record "Loan Application")
    var
        Outbal: Decimal;
    begin
        with Customer do begin

            LoanApplicationSetup.GET;
            SourceCodeSetup.GET;
            LoanProductType.Get(Customer."Customer Posting Group");
            TransactionTypeCodeSetup.Get();
            SourceCodeSetup.TestField(Loan);
            TransactionTypeCodeSetup.TestField("Penalty Due");
            TransactionTypeCodeSetup.TestField("Penalty Paid");
            LoanApplicationSetup.TestField("Penalty Template Name");
            LoanApplicationSetup.TestField("Penalty Batch Name");
            DFilter := '..' + Format(PostingDate);
            Outbal := 0;
            Loan.CalcFields("Outstanding Balance");
            Outbal := Loan."Outstanding Balance";
            MonthDateFilter := Format(RunDate) + '..' + Format(PostingDate);

            CustL.Reset();
            CustL.SetRange("Customer No.", Customer."No.");
            CustL.SetFilter("Posting Date", MonthDateFilter);
            CustL.SetRange("Transaction Type Code", TransactionTypeCodeSetup."Principal Paid", TransactionTypeCodeSetup."Loan Prepayment");
            CustL.SetRange(Reversed, false);
            if CustL.FindSet() then begin
                repeat
                    CustL.CalcFields("Credit Amount");
                    AmountPaid += CustL."Credit Amount";
                until CustL.Next = 0;
            end;

            if AmountPaid = 0 then begin
                PenaltyDue := 0;
                PenaltyDue := Round(((5 / 100) * Outbal), 1, '=');
            end;

            if AmountPaid > 0 then begin
                PenaltyDue := 0;
                if AmountPaid < Loan."Approved Amount" then begin
                    PenaltyDue := Round(((5 / 100) * Outbal), 1, '=');
                end
            end;

            CustL.Reset();
            CustL.SetRange("Customer No.", Customer."No.");
            CustL.SetRange("Posting Date", PostingDate);
            CustL.SetRange(Reversed, false);
            CustL.SetRange("Transaction Type Code", 'PENDUE');
            if not CustL.FindSet() then begin
                PenaltyDue := PenaltyDue;
            end else begin
                PenaltyDue := 0;
            end;

            If PenaltyDue > 0 Then Begin
                GlobalManagement.CreateJournal(LoanApplicationSetup."Penalty Template Name", LoanApplicationSetup."Penalty Batch Name", 'PEN-' + Format(PostingDate), "No.", PostingDate, AccountTypeEnum::Customer, "No.", Text000 + "No.", PenaltyDue, LoanProductType."Penalty Paid Posting Group",
                TransactionTypeCodeSetup."Penalty Due", SourceCodeSetup.Loan, "Global Dimension 1 Code", BalAccountTypeEnum::"G/L Account", '', AppliesToDocTypeEnum::" ", '');
                GlobalManagement.CreateJournal(LoanApplicationSetup."Penalty Template Name", LoanApplicationSetup."Penalty Batch Name", 'PEN-' + Format(PostingDate), "No.", PostingDate, AccountTypeEnum::"G/L Account", LoanProductType."Penalty Paid Posting Group", Text000 + "No.", -PenaltyDue, '',
                '', SourceCodeSetup.Loan, "Global Dimension 1 Code", BalAccountTypeEnum::"G/L Account", '', AppliesToDocTypeEnum::" ", '');
            end;
        end;
    end;

    procedure CreateMobileDefaultLoan(Var Customer: Record Customer; postingDate: Date)
    begin
        with Customer Do Begin
            Customer.SetFilter("Date Filter", '..%1', PostingDate);
            LoanApplicationSetup.GET;

            IF Member.GET(BOSAManagement.fnGetmemberNo("No.")) THEN BEGIN
                penBal := 0;
                intBal := 0;
                princBal := 0;
                Outbal := 0;

                CalcFields("Net Change");
                Outbal := "Net Change";
                DFilter := '..' + Format(PostingDate);

                DCustL.Reset();
                DCustL.SetRange("Customer No.", Customer."No.");
                DCustL.SetFilter("Posting Date", DFilter);
                if DCustL.FindSet() then begin
                    repeat
                        if (DCustL."Transaction Type Code" = 'PENDUE') or (DCustL."Transaction Type Code" = 'PENPAID') then
                            penBal += DCustL.Amount;
                        if (DCustL."Transaction Type Code" = 'INTPAID') or (DCustL."Transaction Type Code" = 'INTDUE') then
                            intBal += DCustL.Amount;
                        if (DCustL."Transaction Type Code" = 'NEWLOAN') or (DCustL."Transaction Type Code" = 'PPAID') then
                            princBal += DCustL.Amount;
                    until DCustL.Next() = 0;
                end;

                defaulterLoanNo := BOSAManagement.createDefaulterloanAccount(Outbal, Member."Phone No.");
                IF LoanApplication.GET(defaulterLoanNo) THEN BEGIN
                    // clear interest
                    GlobalManagement.CreateJournal(LoanApplicationSetup."Penalty Template Name", LoanApplicationSetup."Penalty Batch Name", 'REC-' + Format(Today), "No.", postingDate, AccountTypeEnum::Customer, "No.", 'loan Recovered Mob ' + "No.", -intBal, LoanProductType."Interest Due Posting Group",
                    'INTPAID', SourceCodeSetup.Loan, "Global Dimension 1 Code", BalAccountTypeEnum::"G/L Account", '', AppliesToDocTypeEnum::" ", '');
                    //recover penalty
                    GlobalManagement.CreateJournal(LoanApplicationSetup."Penalty Template Name", LoanApplicationSetup."Penalty Batch Name", 'REC-' + Format(Today), "No.", postingDate, AccountTypeEnum::Customer, "No.", 'Penalty Recovered ' + "No.", -penBal, LoanProductType."Penalty Due Posting Group",
                    'PENPAID', SourceCodeSetup.Loan, "Global Dimension 1 Code", BalAccountTypeEnum::"G/L Account", '', AppliesToDocTypeEnum::" ", '');
                    //recover principal
                    GlobalManagement.CreateJournal(LoanApplicationSetup."Penalty Template Name", LoanApplicationSetup."Penalty Batch Name", 'REC-' + Format(Today), "No.", postingDate, AccountTypeEnum::Customer, "No.", 'Principal Recovered ' + "No.", -princBal, LoanProductType."Loan Posting Group",
                    'PPAID', SourceCodeSetup.Loan, "Global Dimension 1 Code", BalAccountTypeEnum::"G/L Account", '', AppliesToDocTypeEnum::" ", '');
                    //newLoan
                    GlobalManagement.CreateJournal(LoanApplicationSetup."Penalty Template Name", LoanApplicationSetup."Penalty Batch Name", 'REC-' + Format(Today), "No.", postingDate, AccountTypeEnum::Customer, defaulterLoanNo, 'Defaulter Recovery ' + "No.", Outbal, '',
                    'NEWLOAN', SourceCodeSetup.Loan, LoanApplication."Global Dimension 1 Code", BalAccountTypeEnum::"G/L Account", '', AppliesToDocTypeEnum::" ", '');
                end;
            end
        end;
    end;
}
 */
