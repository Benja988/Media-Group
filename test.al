ProcessCheckOffsExcess(CheckOffHeader : Record "Check Off Header")
// IF CONFIRM('Do you want to post the check Off?') THEN BEGIN
  WITH CheckOffHeader DO BEGIN
    ClearLines;
    TESTFIELD("Posting Date");
    PostingDate := "Posting Date";
    PostingLogs.RESET;
    PostingLogs.SETRANGE("Payout No","No.");
    IF PostingLogs.FINDSET THEN BEGIN
      PostingLogs.DELETEALL;
    END;
    Bosa.ClearJournal(CBSSetup."Check Off Template Name",CBSSetup."Check Off Batch Name");
    TransactionTypes.GET("Payment Type");
    Window.OPEN('Processing checkoff\Current:###1#######\Total:###2#######\Progress:@@@3@@@@@@@');
    LineNo := 0;
    i := 0;
    j := 0;
    ExcessMessage := '';
    CheckOffLines.RESET;
    CheckOffLines.SETRANGE("Document No.","No.");
    IF CheckOffLines.FINDSET THEN BEGIN
      j := CheckOffLines.COUNT;
      REPEAT
        CheckOffLines."Excess Amount" := 0;
        CheckOffLines.MODIFY;
         
        i += 1;
        Window.UPDATE(1,i);
        Window.UPDATE(2,j);
        Window.UPDATE(3,((i/j) * 10000) DIV 1);
        IF CheckOffLines."Posted To Suspense" = FALSE THEN BEGIN
          CBSSetup.GET();
          AccountType := AccountType::"G/L Account";
          ExcessAmount := 0;
          GetMemberAccounts(CheckOffLines."Member No.",DepositAcc,SharesAcc,HouseDeposit,HouseShareCap,Holiday,Unallocated,Registration,HousingEntrance);
          // Temp buffer for details
          TempGenJnlLine.RESET;
          TempGenJnlLine.DELETEALL;
          TotalDetails := 0;
          DistRec.RESET;
          DistRec.SETRANGE("Document No.","No.");
          DistRec.SETRANGE("Member No.",CheckOffLines."Member No.");
          IF DistRec.FINDSET THEN BEGIN
            REPEAT
              // Deposit Contributions
              IF DistRec."Deposit Amount" > 0 THEN BEGIN
                IF Member.GET(CheckOffLines."Member No.") THEN BEGIN
                  IF Member."Registration Fee paid" = FALSE THEN BEGIN
                    IF Registration = '' THEN
                      Registration := CreateDefaultAccount(CheckOffLines."Member No.",AccType::Registration);
                    RoundedAmt := ROUND(CBSSetup."Registration Fee", 0.01);
                    CreateJournalLineTemp(TempGenJnlLine,"No.",'Entrance Fees Member No '+CheckOffLines."Member No."+' '+CheckOffLines."Cheque No",AccountType::Vendor,Registration,
                                      "Control Account Type",'',-RoundedAmt,'',PaymentType::Cheque,TType::"Registration Fee",PostingDate,CheckOffLines."Member No.");
                    TotalDetails += RoundedAmt;
                    DistRec."Deposit Amount" -= RoundedAmt;
                  END;
                END;
                IF DistRec."Deposit Amount" > 0 THEN BEGIN
                  ShareCapBalance := GetAccBalance(Member."No.",'02');
                  IF ShareCapBalance > 0 THEN BEGIN
                    IF ShareCapBalance > DistRec."Deposit Amount" THEN ShareCapBalance := DistRec."Deposit Amount";
                    RoundedAmt := ROUND(ShareCapBalance, 0.01);
                    IF SharesAcc = '' THEN
                      SharesAcc := CreateDefaultAccount(CheckOffLines."Member No.",AccType::"Share Capital");
                    CreateJournalLineTemp(TempGenJnlLine,"No.",'Shares Contribution Member No '+CheckOffLines."Member No."+' '+CheckOffLines."Cheque No",AccountType::Vendor,SharesAcc,
                                      "Control Account Type",'',-RoundedAmt,'',PaymentType::Cheque,TType::"Shares Contributions",PostingDate,CheckOffLines."Member No.");
                    TotalDetails += RoundedAmt;
                    DistRec."Deposit Amount" -= RoundedAmt;
                  END;
                END;
                IF DistRec."Deposit Amount" > 0 THEN BEGIN
                  IF DepositAcc = '' THEN
                    DepositAcc := CreateDefaultAccount(CheckOffLines."Member No.",AccType::Deposit);
                  RoundedAmt := ROUND(DistRec."Deposit Amount", 0.01);
                  CreateJournalLineTemp(TempGenJnlLine,"No.",'Deposit Contribution Member No '+CheckOffLines."Member No."+' '+CheckOffLines."Cheque No",AccountType::Vendor,DepositAcc,
                                    "Control Account Type",'',-RoundedAmt,'',PaymentType::Cheque,TType::"Deposit Contribution",PostingDate,CheckOffLines."Member No.");
                  TotalDetails += RoundedAmt;
                END;
              END;
              // Holiday Savings
              IF DistRec.Holiday > 0 THEN BEGIN
                IF Holiday = '' THEN
                  Holiday := CreateDefaultAccount(CheckOffLines."Member No.",AccType::Holiday);
                RoundedAmt := ROUND(DistRec.Holiday, 0.01);
                CreateJournalLineTemp(TempGenJnlLine,"No.",'Holiday Savings Member No '+CheckOffLines."Member No."+' '+CheckOffLines."Cheque No",AccountType::Vendor,Holiday,
                                  "Control Account Type",'',-RoundedAmt,'',PaymentType::Cheque,TType::" ",PostingDate,CheckOffLines."Member No.");
                TotalDetails += RoundedAmt;
              END;
              // Housing Contributions
              IF DistRec."Housing Amount" > 0 THEN BEGIN
                HousingBal := DistRec."Housing Amount";
                IF Member.GET(CheckOffLines."Member No.") THEN BEGIN
                  IF Member."Housing Entrance Paid" = FALSE THEN BEGIN
                    IF HousingEntrance = '' THEN
                      HousingEntrance := CreateDefaultAccount(CheckOffLines."Member No.",AccType::"Housing Entrance");
                    RoundedAmt := ROUND(CBSSetup."Housing Entrance Fee", 0.01);
                    CreateJournalLineTemp(TempGenJnlLine,"No.",'Housing Entrance Fees Member No '+CheckOffLines."Member No."+' '+CheckOffLines."Cheque No",AccountType::Vendor,HousingEntrance,
                                      "Control Account Type",'',-RoundedAmt,'',PaymentType::Cheque,TType::"Housing Entrance Fee",PostingDate,CheckOffLines."Member No.");
                    TotalDetails += RoundedAmt;
                    HousingBal -= RoundedAmt;
                  END;
                  IF HousingBal > 0 THEN BEGIN
                    HShareCapBalance := GetAccBalance(Member."No.",'04');
                    IF HShareCapBalance > 0 THEN BEGIN
                      IF HShareCapBalance > HousingBal THEN HShareCapBalance := HousingBal;
                      RoundedAmt := ROUND(HShareCapBalance, 0.01);
                      IF HouseShareCap = '' THEN
                        HouseShareCap := CreateDefaultAccount(CheckOffLines."Member No.",AccType::"Housing Share Capital");
                      CreateJournalLineTemp(TempGenJnlLine,"No.",'Housing ShareCap Member No '+CheckOffLines."Member No."+' '+CheckOffLines."Cheque No",AccountType::Vendor,HouseShareCap,
                                        "Control Account Type",'',-RoundedAmt,'',PaymentType::Cheque,TType::"Housing Share Capital",PostingDate,CheckOffLines."Member No.");
                      TotalDetails += RoundedAmt;
                      HousingBal -= RoundedAmt;
                    END;
                  END;
                  IF HousingBal > 0 THEN BEGIN
                    IF HouseDeposit = '' THEN
                      HouseDeposit := CreateDefaultAccount(CheckOffLines."Member No.",AccType::"Housing Deposit");
                    RoundedAmt := ROUND(HousingBal, 0.01);
                    CreateJournalLineTemp(TempGenJnlLine,"No.",'Housing Contribution Member No '+CheckOffLines."Member No."+' '+CheckOffLines."Cheque No",AccountType::Vendor,HouseDeposit,
                                      "Control Account Type",'',-RoundedAmt,'',PaymentType::Cheque,TType::"Housing Contribution",PostingDate,CheckOffLines."Member No.");
                    TotalDetails += RoundedAmt;
                  END;
                END;
              END;
              // Loan Interest and Principal from Distribution
              IF (DistRec."Interest Amount" > 0) OR (DistRec."Principal Amount" > 0) THEN BEGIN
                IF DistRec."Loan No." <> '' THEN BEGIN
                  Loan.GET(DistRec."Loan No.");
                 
                  IF LProd.GET(DistRec."Loan Product Type") THEN BEGIN
                    IF LProd.Code <> 'LP022' THEN BEGIN // Exempting mobile loans from checkoff posting
                      ValidAmount := ROUND(DistRec."Interest Amount", 0.01);
                      IF ValidAmount > 0 THEN BEGIN
                          {CreateJournalLine("No.",'Loan Interest Due Member No '+DistRec."Loan No."+' '+CheckOffLines."Member No.",AccountType::Customer,DistRec."Loan No.",BalAccountType::"G/L Account",LProd."Interest Income Account",
                                            ROUND(ValidAmount),'',PaymentType::Cheque,TType::"Interest Due",PostingDate,CheckOffLines."Member No.");}
                          CreateJournalLineTemp(TempGenJnlLine,"No.",'Loan Interest Paid Member No '+DistRec."Loan No."+' '+CheckOffLines."Member No."+' Cheq-'+CheckOffLines."Cheque No",AccountType::Customer,DistRec."Loan No.",
                                            BalAccountType::"G/L Account",ControlAcc,-ValidAmount,'',PaymentType::Cheque,TType::"Interest Paid",PostingDate,CheckOffLines."Member No.");
                          TotalDetails += ValidAmount;
                        END ELSE IF ABS(ValidAmount) > 0 THEN BEGIN
                          // Route tiny amounts to excess
                          CheckOffLines."Excess Amount" += ValidAmount;
                        END ELSE BEGIN
                          // Log error for invalid interest amount
                          PostingLogs.RESET;
                          IF PostingLogs.FINDLAST THEN BEGIN
                            PostEntryNo := PostingLogs."Entry No";
                          END;
                          PostingLogs.INIT;
                          PostingLogs."Entry No" := PostEntryNo + 1000;
                          PostingLogs."Member No" := CheckOffLines."Member No.";
                          PostingLogs."Loan No" := DistRec."Loan No.";
                          PostingLogs."Payout No" := "No.";
                          PostingLogs.Amount := DistRec."Interest Amount";
                          PostingLogs.Description := 'Invalid Interest Amount for Loan ' + DistRec."Loan No.";
                          PostingLogs."Allocation Date" := PostingDate;
                          PostingLogs."Unallocated Amount" := DistRec."Interest Amount";
                          PostingLogs."Error Code" := 3;
                          PostingLogs.INSERT;
                          ExcessMessage += STRSUBSTNO('Member %1, Loan No: %2, Invalid Interest Amount: %3\\',
                                                      CheckOffLines."Member No.", DistRec."Loan No.", DistRec."Interest Amount");
                       
                      END;
                      IF DistRec."Principal Amount" > 0 THEN BEGIN
                        RoundedAmt := ROUND(DistRec."Principal Amount", 0.01);
                        CreateJournalLineTemp(TempGenJnlLine,"No.",'Loan Principal Payment Loan No: '+DistRec."Loan No."+' Member No: '+CheckOffLines."Member No.",AccountType::Customer,DistRec."Loan No.",BalAccountType::"G/L Account",'',
                                          -RoundedAmt,'',PaymentType::Cheque,TType::Repayment,PostingDate,CheckOffLines."Member No.");
                        TotalDetails += RoundedAmt;
                      END;
                    END;
                  END;
                END;
              END;
            UNTIL DistRec.NEXT = 0;
          END;
          // Handle Excess Amount
          ExcessAmt := ROUND(CheckOffLines."Received Amount" - (CheckOffLines.Holiday + CheckOffLines."Deposit Contribution" + CheckOffLines."Housing Contribution" + CheckOffLines."Loan Amount"), 0.01);
          IF ExcessAmt <> 0 THEN BEGIN
            CheckOffLines."Excess Amount" := ExcessAmt;
            CheckOffLines.MODIFY;
            ExcessMessage += STRSUBSTNO('Member %1, Payroll No: %2, Excess Amount: %3',
                                        CheckOffLines."Member No.", CheckOffLines."Payroll No.", ExcessAmt);
            IF CheckOffHeader.AllowGeneralExcess THEN BEGIN
              ProcessMembLoansExcess(CheckOffLines."Member No.",ExcessAmt,"No.",PostingDate,"Control Account");
            END ELSE BEGIN
              PostingLogs.RESET;
              IF PostingLogs.FINDLAST THEN BEGIN
                PostEntryNo := PostingLogs."Entry No";
              END;
              PostingLogs.INIT;
              PostingLogs."Entry No" := PostEntryNo + 1000;
              PostingLogs."Member No" := CheckOffLines."Member No.";
              PostingLogs."Payout No" := "No.";
              PostingLogs.Amount := ExcessAmt;
              PostingLogs.Description := 'Member Unallocated Excess Amount';
              PostingLogs."Allocation Date" := PostingDate;
              PostingLogs."Unallocated Amount" := ExcessAmt;
              PostingLogs."Error Code" := 1;
              PostingLogs.INSERT;
            END;
          END;
          // Now create control line with sum of details
          CreateJournalLine("No.",FORMAT(Description)+' Member '+CheckOffLines."Member No.",AccountType,"Control Account",BalAccountType::"G/L Account",'',
                            ROUND(TotalDetails, 0.01),'',PaymentType::Cash,TType::" ",PostingDate,CheckOffLines."Member No.");
          // Copy temp lines to real journal
          IF TempGenJnlLine.FINDSET THEN REPEAT
            CreateJournalLineFromTemp(TempGenJnlLine); // Assume a helper to copy
          UNTIL TempGenJnlLine.NEXT = 0;
        END;
      UNTIL CheckOffLines.NEXT = 0;
    END;
    Window.CLOSE;
    CBSSetup.GET;
    IF PostJournal(CBSSetup."Check Off Template Name",CBSSetup."Check Off Batch Name") THEN BEGIN
      Posted := TRUE;
      "Posted At" := TIME;
      "Posted On" := TODAY;
      "Posted By" := USERID;
      Status := Status::Approved;
      "Status 2" := "Status 2"::Posted;
      MODIFY;
      UpdateMembers;
    END;
    IF "Excess Amounts" OR (ExcessMessage <> '') THEN BEGIN
      MESSAGE('Checkoff posted with excess amounts or errors:\\%1', ExcessMessage);
    END;
  END;

ProcessMembLoansExcess(MemberNo : Code[10];LoanAmount : Decimal;HeaderNo : Code[10];Pdate : Date;ControlAcc : Code[10])
RunBal := LoanAmount;
LoanAmount2 := 0;
CBSSetup.GET();
Loan.RESET;
Loan.SETRANGE(Loan."Member No.",MemberNo);
Loan.SETRANGE("Non-Checkoff",FALSE);
Loan.SETFILTER("Outstanding Balance",'>%1',0);
Loan.SETCURRENTKEY("Disbursal Date");
IF Loan.FINDSET THEN BEGIN
  REPEAT
    IF RunBal > 0 THEN BEGIN
      LoanAcc := Loan."No.";
      // Interest Allocation
      InterestAmount := 0;
      ProcessMemberInterestExcess(MemberNo,Loan."Loan Product Type",RunBal,HeaderNo,Pdate,ControlAcc,Loan."No.");
      RoundedRunBal := ROUND(RunBal, 0.01);
      IF RoundedRunBal > 0 THEN BEGIN
        CreateJournalLineTemp(TempGenJnlLine, HeaderNo,'Loan Principal Payment Loan No: '+LoanAcc+' Member No: '+Loan."Member No.",AccountType::Customer,LoanAcc,BalAccountType::"G/L Account",'',
                          -RoundedRunBal,'',PaymentType::Cheque,TType::Repayment,Pdate,Loan."Member No.");
        RunBal -= RoundedRunBal;
      END;
    END;
  UNTIL Loan.NEXT = 0;
END;
IF ABS(RunBal) > 0 THEN BEGIN
  PostingLogs.RESET;
  IF PostingLogs.FINDLAST THEN BEGIN
    PostEntryNo := PostingLogs."Entry No";
  END;
  PostingLogs.INIT;
  PostingLogs."Entry No" := PostEntryNo + 1000;
  PostingLogs."Member No" := MemberNo;
  PostingLogs."Loan No" := '';
  PostingLogs.Amount := RunBal;
  PostingLogs.Description := 'Member Unallocated Excess Loan Amount';
  PostingLogs."Allocation Date" := Pdate;
  PostingLogs."Unallocated Amount" := RunBal;
  PostingLogs."Payout No" := HeaderNo;
  PostingLogs."Error Code" := 1;
  PostingLogs.INSERT;
  LoanAmount2 := RunBal;
END;

LOCAL ProcessMemberInterestExcess(MemberNo : Code[10];LProduct : Code[10];IntAmount : Decimal;HeaderNo : Code[10];Pdate : Date;ControlAcc : Code[10];Cheque : Code[10])
RunBal := IntAmount;
LoanAmount2 := 0;
CBSSetup.GET();
Loan.RESET;
Loan.SETRANGE(Loan."Member No.",MemberNo);
Loan.SETRANGE(Loan."Loan Product Type",LProduct);
Loan.SETRANGE(Loan.Posted,TRUE);
Loan.SETFILTER("Outstanding Balance",'>%1',0);
IF Loan.FINDFIRST THEN BEGIN
  LoanAcc := Loan."No.";
  IF RunBal > 0 THEN BEGIN
    InterestAmount := RunBal;
    RoundedInterest := ROUND(InterestAmount, 0.01);
    IF RoundedInterest > 0 THEN BEGIN
      LProd.GET(Loan."Loan Product Type");
      {CreateJournalLine(HeaderNo,'Loan Interest Due Member No '+LoanAcc+' '+Loan."Member No.",AccountType::Customer,LoanAcc,BalAccountType::"G/L Account",LProd."Interest Income Account",
                        ROUND(InterestAmount),'',PaymentType::Cheque,TType::"Interest Due",Pdate,Loan."Member No.");}
      CreateJournalLineTemp(TempGenJnlLine,HeaderNo,'Loan Interest Paid Member No '+LoanAcc+' '+Loan."Member No."+' Cheq-'+Cheque,AccountType::Customer,LoanAcc,BalAccountType::"G/L Account",ControlAcc,
                        -RoundedInterest,'',PaymentType::Cheque,TType::"Interest Paid",Pdate,Loan."Member No.");
      LoanAmount2 := RoundedInterest;
      RunBal -= RoundedInterest;
    END;
  END;
END;
IF ABS(RunBal) > 0 THEN BEGIN
  PostingLogs.RESET;
  IF PostingLogs.FINDLAST THEN BEGIN
    PostEntryNo := PostingLogs."Entry No";
  END;
  PostingLogs.INIT;
  PostingLogs."Entry No" := PostEntryNo + 1000;
  PostingLogs."Member No" := MemberNo;
  PostingLogs."Loan No" := LoanAcc;
  PostingLogs.Amount := RunBal;
  PostingLogs.Description := 'Member Unallocated Interest Amount';
  PostingLogs."Allocation Date" := Pdate;
  PostingLogs."Unallocated Amount" := RunBal;
  PostingLogs."Payout No" := HeaderNo;
  PostingLogs."Loan Product" := LProduct;
  PostingLogs."Error Code" := 1;
  PostingLogs.INSERT;
  LoanAmount2 := RunBal;
END;

PopulateExcess Amount Distribution - OnAction()
TESTFIELD("Posting Date");
COMMIT;
IF NOT CONFIRM('This will (re)create default distribution rows. Continue?') THEN
  EXIT;
// AllowOverwrite := CheckoffHeader.AllowOverwriteDistribution;
// DistribRec.ClearDocumentDistributions(DocumentNo, AllowOverwrite);
DistribRec.PopulateDistributionsFromUpload(Rec."No.", Rec);
CheckOffLine.RESET;
CheckOffLine.SETRANGE("Document No.", Rec."No.");
IF CheckOffLine.FINDSET THEN
  REPEAT
    IF CheckOffLine."Excess Amount" > 0 THEN
      DistribRec.DistributeExcessForLine(Rec."No.", CheckOffLine."Line No.", Rec.AllowGeneralExcess);
  UNTIL CheckOffLine.NEXT = 0;
IF Rec.AllowGeneralExcess THEN BEGIN
  Rec."Populate Excess" := TRUE;
  Rec.MODIFY;
END;
MESSAGE('Distribution table populated. Open "View Amount Distribution" to review/edit before posting.');

PopulateDistributionsFromUpload(DocumentNo : Code[20];HeaderRec : Record "Check Off Header")
AllowOverwrite := HeaderRec.AllowOverwriteDistribution;
ClearDocumentDistributions(DocumentNo, TRUE);
UploadRec.RESET();
UploadRec.SETRANGE("Document No.", DocumentNo);
IF NOT UploadRec.FINDSET() THEN
    EXIT;
REPEAT
    MemberRec.RESET();
    MemberRec.SETRANGE("Payroll No.", UploadRec."Payroll No.");
    IF NOT MemberRec.FINDFIRST() THEN
        ERROR('Member %1 with payroll no %2 does not exist (Upload entry)', UploadRec."Member Name", UploadRec."Payroll No.");
    CheckOffLineRec.RESET();
    CheckOffLineRec.SETRANGE("Document No.", DocumentNo);
    CheckOffLineRec.SETRANGE("Payroll No.", UploadRec."Payroll No.");
    IF NOT CheckOffLineRec.FINDFIRST() THEN BEGIN
        CheckOffLineRec.INIT();
        CheckOffLineRec."Document No." := DocumentNo;
        CheckOffLineRec."Line No." := GetNextCheckOffLineNo(DocumentNo);
        CheckOffLineRec."Payroll No." := UploadRec."Payroll No.";
        CheckOffLineRec."Member No." := MemberRec."No.";
        CheckOffLineRec."Member Name" := MemberRec."Full Name";
        CheckOffLineRec."Deposit Contribution" := ROUND(UploadRec."Deposit Sacco", 0.01);
        CheckOffLineRec."Loan Amount" := ROUND(UploadRec."Loan Amount", 0.01);
        CheckOffLineRec."Housing Contribution" := ROUND(UploadRec."Housing Contribution", 0.01);
        CheckOffLineRec.Holiday := ROUND(UploadRec.Holiday, 0.01);
        CheckOffLineRec."Received Amount" := ROUND(UploadRec."Received Amount", 0.01);
        CheckOffLineRec.INSERT();
    END;
    DistributionRec.RESET();
    DistributionRec.SETRANGE("Document No.", DocumentNo);
    DistributionRec.SETRANGE("Member No.", CheckOffLineRec."Member No.");
    IF DistributionRec.FINDSET() THEN
        DistributionRec.DELETEALL();
    DistributeForMember(DocumentNo, CheckOffLineRec."Line No.", CheckOffLineRec."Member No.",
                        CheckOffLineRec."Deposit Contribution", CheckOffLineRec."Housing Contribution",
                        CheckOffLineRec.Holiday, CheckOffLineRec."Loan Amount",
                        HeaderRec.AllowOverwriteDistribution, HeaderRec."Posting Date");
UNTIL UploadRec.NEXT() = 0;
DistributionRec.UpdateCheckOffLinesFromDistribution(DocumentNo);

UpdateCheckOffLinesFromDistribution(DocumentNo : Code[20])
LineRec.RESET();
LineRec.SETRANGE("Document No.", DocumentNo);
IF NOT LineRec.FINDSET() THEN
    EXIT;
REPEAT
    DepositTotal := 0;
    HousingTotal := 0;
    HolidayTotal := 0;
    LoanTotal := 0;
    ExcessTotal := 0;
    ActualAmount := 0;
    DistRec.RESET();
    DistRec.SETRANGE("Document No.", DocumentNo);
    DistRec.SETRANGE("Line No.", LineRec."Line No.");
    IF DistRec.FINDSET() THEN
        REPEAT
            DistRec."Deposit Amount" := ROUND(DistRec."Deposit Amount", 0.01);
            DistRec."Housing Amount" := ROUND(DistRec."Housing Amount", 0.01);
            DistRec.Holiday := ROUND(DistRec.Holiday, 0.01);
            DistRec."Interest Amount" := ROUND(DistRec."Interest Amount", 0.01);
            DistRec."Principal Amount" := ROUND(DistRec."Principal Amount", 0.01);
            DistRec.MODIFY;
            DepositTotal += DistRec."Deposit Amount";
            HousingTotal += DistRec."Housing Amount";
            LoanTotal += DistRec."Interest Amount" + DistRec."Principal Amount";
            HolidayTotal += DistRec.Holiday;
            ActualAmount := DepositTotal + HousingTotal + LoanTotal + HolidayTotal;
            
            {IF DistRec."Loan No." = '' THEN
                HolidayTotal += DistRec."Distributed Amount";}
        UNTIL DistRec.NEXT() = 0;
    LineRec."Deposit Contribution" := ROUND(DepositTotal, 0.01);
    LineRec."Housing Contribution" := ROUND(HousingTotal, 0.01);
    LineRec."Loan Amount" := ROUND(LoanTotal, 0.01);
    LineRec.Holiday := ROUND(HolidayTotal, 0.01);
    // LineRec."Received Amount" := DepositTotal + HousingTotal + HolidayTotal + LoanTotal;
    LineRec."Excess Amount" := ROUND(LineRec."Received Amount" - ActualAmount, 0.01);
// MESSAGE('Member %1 has excess of %2', LineRec."Member No.", LineRec."Excess Amount");
   
    LineRec.MODIFY();
    // ExcessAmount := CalculateMemberExcessAmount(DocumentNo, LineRec."Member No.");
    // Optional: Display message if there's excess
    {IF ExcessAmount > 0 THEN
        MESSAGE('Member %1 has excess of %2', LineRec."Member No.", FORMAT(ExcessAmount));}
UNTIL LineRec.NEXT() = 0;
MESSAGE('Check Off Lines updated successfully from distribution.');

DistributeExcessForLine(DocumentNo : Code[20];LineNo : Integer;AllowGeneralExcess : Boolean)
    ChLine.RESET;
    ChLine.SETRANGE("Document No.", DocumentNo);
    ChLine.SETRANGE("Line No.", LineNo);
    IF NOT ChLine.FINDFIRST THEN
        EXIT;
    TotalExcess := ROUND(ChLine."Excess Amount", 0.01);
    IF TotalExcess <= 0 THEN
        EXIT;
    Dist.RESET;
    Dist.SETRANGE("Document No.", DocumentNo);
    Dist.SETRANGE("Line No.", LineNo);
    IF NOT AllowGeneralExcess THEN
        Dist.SETRANGE("Distribute Excess", TRUE);
    IF NOT Dist.FINDFIRST THEN
        ERROR(
            'Mark distribute excess to yes before populating the amount.'
        );
    Dist.RESET;
    Dist.SETRANGE("Document No.", DocumentNo);
    Dist.SETRANGE("Line No.", LineNo);
    Dist.SETFILTER("Loan No.", '%1', 'EXCESS');
    IF Dist.FINDFIRST THEN
        REPEAT
            Dist.DELETE;
        UNTIL Dist.NEXT = 0;
    Dist.RESET;
    Dist.SETRANGE("Document No.", DocumentNo);
    Dist.SETRANGE("Line No.", LineNo);
    Dist.SETFILTER("Loan No.", '<>%1', '');
    Dist.SETFILTER("Loan Product Type",'<>%1','LP022');
    IF NOT AllowGeneralExcess THEN
        Dist.SETRANGE("Distribute Excess", TRUE);
    IF Dist.FINDLAST THEN BEGIN
        Dist."Principal Amount" := ROUND(Dist."Principal Amount" + TotalExcess, 0.01);
        Dist."Distributed Amount" := ROUND(Dist."Distributed Amount" + TotalExcess, 0.01);
        Dist."Excess Amount" := ROUND(TotalExcess, 0.01);
        Dist.MODIFY(TRUE);
    END ELSE BEGIN
        DepositDist.RESET;
        DepositDist.SETRANGE("Document No.", DocumentNo);
        DepositDist.SETRANGE("Line No.", LineNo);
        DepositDist.SETFILTER("Loan No.", '%1', '');
        DepositDist.SETFILTER("Deposit Amount", '>%1', 0);
        IF DepositDist.FINDFIRST THEN BEGIN
            DepositDist."Deposit Amount" := ROUND(DepositDist."Deposit Amount" + TotalExcess, 0.01);
            DepositDist."Distributed Amount" := ROUND(DepositDist."Distributed Amount" + TotalExcess, 0.01);
            DepositDist."Excess Amount" := 0;
            DepositDist.MODIFY(TRUE);
        END ELSE
            ERROR('No loan or deposit found to allocate excess for line %1.', LineNo);
    END;